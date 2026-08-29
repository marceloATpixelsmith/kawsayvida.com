import postgres from "postgres";

let client: ReturnType<typeof postgres> | null = null;
let tableReady: Promise<void> | null = null;

const LOGGING_WAIT_LIMIT_MS = 1_000;
const DURABLE_LOGGING_WAIT_LIMIT_MS = 2_500;

function sanitizeConnectionString(connectionString: string): string
{
  try
    {
      const url = new URL(connectionString);
      url.searchParams.delete("schema");
      return url.toString();
    }
  catch
    {
      return connectionString;
    }
}

function createClient(): ReturnType<typeof postgres> | null
{
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    {
      return null;
    }

  return postgres(sanitizeConnectionString(connectionString), {
    max: 1,
    connect_timeout: 2,
  });
}

function getClient(): ReturnType<typeof postgres> | null
{
  if (!client)
    {
      client = createClient();
    }

  return client;
}

async function ensureTable(db: ReturnType<typeof postgres>): Promise<void>
{
  if (!tableReady)
    {
      tableReady = (async () => {
        await db`CREATE SCHEMA IF NOT EXISTS pixelsmithforms`;
        await db`
          CREATE TABLE IF NOT EXISTS pixelsmithforms.form_submissions (
            id BIGSERIAL PRIMARY KEY,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            site TEXT NOT NULL,
            form TEXT NOT NULL,
            stage TEXT NOT NULL,
            outcome TEXT NOT NULL,
            complete BOOLEAN NOT NULL DEFAULT false,
            validated BOOLEAN,
            fields JSONB,
            notification_sent BOOLEAN,
            notification_recipients JSONB,
            notification_provider_id TEXT,
            ip TEXT,
            user_agent TEXT,
            referer TEXT,
            lang TEXT
          )
        `;
      })().catch((err) => {
        tableReady = null;
        throw err;
      });
    }

  await tableReady;
}

export interface FormSubmissionRecord
{
  site: string;
  form: string;
  stage: "client_attempt" | "server_processed";
  outcome: string;
  complete: boolean;
  validated?: boolean;
  fields?: Record<string, unknown>;
  notificationSent?: boolean;
  notificationRecipients?: string[];
  notificationProviderId?: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
  lang?: string;
}

async function insertFormSubmission(
  db: ReturnType<typeof postgres>,
  record: FormSubmissionRecord,
): Promise<void>
{
  type Jsonable = Parameters<typeof db.json>[0];
  await db`
    INSERT INTO pixelsmithforms.form_submissions (
      site, form, stage, outcome, complete, validated, fields,
      notification_sent, notification_recipients, notification_provider_id,
      ip, user_agent, referer, lang
    ) VALUES (
      ${record.site}, ${record.form}, ${record.stage}, ${record.outcome}, ${record.complete},
      ${record.validated ?? null}, ${record.fields ? db.json(record.fields as Jsonable) : null},
      ${record.notificationSent ?? null},
      ${record.notificationRecipients ? db.json(record.notificationRecipients as Jsonable) : null},
      ${record.notificationProviderId ?? null}, ${record.ip ?? null}, ${record.userAgent ?? null},
      ${record.referer ?? null}, ${record.lang ?? null}
    )
  `;
}

async function persistFormSubmission(
  db: ReturnType<typeof postgres>,
  record: FormSubmissionRecord,
): Promise<void>
{
  try
    {
      await ensureTable(db);
      await insertFormSubmission(db, record);
    }
  catch (err)
    {
      console.log("[v0] Form submission tracking failed:", err);
    }
}

function submissionClient(): ReturnType<typeof postgres> | null
{
  const db = getClient();
  if (!db)
    {
      console.log("[v0] Form submission tracking skipped: DATABASE_URL is not configured.");
    }
  return db;
}

async function persistNotificationSubmissionWithDeadline(record: FormSubmissionRecord): Promise<void>
{
  const db = createClient();
  if (!db)
    {
      console.log("[v0] Form submission tracking skipped: DATABASE_URL is not configured.");
      return;
    }

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timeoutHandle = setTimeout(() => resolve("timeout"), DURABLE_LOGGING_WAIT_LIMIT_MS);
  });
  const persisted = (async () => {
    try
      {
        await db`CREATE SCHEMA IF NOT EXISTS pixelsmithforms`;
        await db`
          CREATE TABLE IF NOT EXISTS pixelsmithforms.form_submissions (
            id BIGSERIAL PRIMARY KEY,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            site TEXT NOT NULL,
            form TEXT NOT NULL,
            stage TEXT NOT NULL,
            outcome TEXT NOT NULL,
            complete BOOLEAN NOT NULL DEFAULT false,
            validated BOOLEAN,
            fields JSONB,
            notification_sent BOOLEAN,
            notification_recipients JSONB,
            notification_provider_id TEXT,
            ip TEXT,
            user_agent TEXT,
            referer TEXT,
            lang TEXT
          )
        `;
        await insertFormSubmission(db, record);
      }
    catch (err)
      {
        console.log("[v0] Form submission tracking failed:", err);
      }
    return "persisted" as const;
  })();
  const result = await Promise.race([persisted, timeout]);

  if (timeoutHandle)
    {
      clearTimeout(timeoutHandle);
    }

  if (result === "timeout")
    {
      console.log("[v0] Durable form submission tracking exceeded its deadline; cancelling the isolated logging client.");
    }

  void db.end({ timeout: 0 }).catch((err) => {
    console.log("[v0] Form submission tracking client shutdown failed:", err);
  });
}

export async function recordFormSubmission(record: FormSubmissionRecord): Promise<void>
{
  if (record.notificationSent !== undefined)
    {
      await persistNotificationSubmissionWithDeadline(record);
      return;
    }

  const db = submissionClient();
  if (!db)
    {
      return;
    }

  if (record.stage === "client_attempt")
    {
      await persistFormSubmission(db, record);
      return;
    }

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timeoutHandle = setTimeout(() => resolve("timeout"), LOGGING_WAIT_LIMIT_MS);
  });
  const persisted = persistFormSubmission(db, record).then(() => "persisted" as const);
  const result = await Promise.race([persisted, timeout]);

  if (timeoutHandle)
    {
      clearTimeout(timeoutHandle);
    }

  if (result === "timeout")
    {
      console.log("[v0] Form submission tracking exceeded the response-path wait limit; continuing without blocking the form response.");
    }
}

export async function recordFormSubmissionDurably(record: FormSubmissionRecord): Promise<void>
{
  const db = submissionClient();
  if (!db)
    {
      return;
    }

  await persistFormSubmission(db, record);
}

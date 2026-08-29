import postgres from "postgres";

// DURABLE SUBMISSION TRACKING, AT THE SITE OWNER'S EXPLICIT REQUEST. THIS
// DELIBERATELY STORES RAW FIELD VALUES — INCLUDING WHATEVER SENSITIVE OR
// HEALTH INFORMATION A FORM COLLECTS — SO NO SUBMISSION IS EVER SILENTLY
// LOST, EVEN ONES A VISITOR NEVER COMPLETED. RESTRICT DATABASE ACCESS
// ACCORDINGLY; THIS IS NOT A PII-FREE LOG.
// STATIC, HARD-CODED IDENTIFIERS — NEVER INTERPOLATE USER INPUT HERE.

let client: ReturnType<typeof postgres> | null = null;
let tableReady: Promise<void> | null = null;

const LOGGING_WAIT_LIMIT_MS = 1_000;

// SOME DATABASE_URL VALUES (E.G. COPIED FROM A PRISMA SETUP) INCLUDE A
// `schema` QUERY PARAM. THAT'S A PRISMA-ONLY CONVENTION, NOT A REAL POSTGRES
// SERVER PARAMETER — RAW POSTGRES FORWARDS UNRECOGNIZED QUERY PARAMS INTO THE
// CONNECTION'S STARTUP PACKET AND THE SERVER REJECTS THE WHOLE CONNECTION
// (`unrecognized configuration parameter "schema"`). THIS MODULE ALREADY
// FULLY QUALIFIES ITS OWN TABLE NAME, SO THE PARAM ISN'T NEEDED — STRIP IT
// DEFENSIVELY RATHER THAN REQUIRE A SPECIFIC CONNECTION-STRING FORMAT.
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

function getClient(): ReturnType<typeof postgres> | null
{
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    {
      return null;
    }

  if (!client)
    {
      client = postgres(sanitizeConnectionString(connectionString), {
        max: 1,
        connect_timeout: 2,
      });
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
        // Let a later call retry setup instead of caching a permanent failure.
        tableReady = null;
        throw err;
      });
    }

  await tableReady;
}

export interface FormSubmissionRecord
{
  /** Which website submitted this — normally the request's Host header. */
  site: string;
  /** Which form — e.g. "contact", "registration". */
  form: string;
  /** "client_attempt" = a submit click seen only by the browser (may never reach the server). "server_processed" = the server actually handled the request. */
  stage: "client_attempt" | "server_processed";
  /** Free-form outcome code, e.g. "blocked_client_validation", "missing_required_fields", "success", "brevo_send_failed". */
  outcome: string;
  /** Whether all required fields were present/valid at this stage. */
  complete: boolean;
  /** Whether server-side validation passed. Omit for client_attempt rows. */
  validated?: boolean;
  /** Raw field values as submitted, whatever they are — deliberately unredacted. */
  fields?: Record<string, unknown>;
  /** Whether the notification email was confirmed sent. */
  notificationSent?: boolean;
  /** Who the notification was (or would have been) sent to. */
  notificationRecipients?: string[];
  /** The email provider's own message/send ID — proof of acceptance for delivery. */
  notificationProviderId?: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
  lang?: string;
}

async function persistFormSubmission(
  db: ReturnType<typeof postgres>,
  record: FormSubmissionRecord,
): Promise<void>
{
  try
    {
      await ensureTable(db);
      // postgres.js's own JSONValue type is stricter than the caller-facing
      // Record<string, unknown>/string[] shapes here; the values passed in
      // are already known-JSON-safe (form field values), so cast to exactly
      // what db.json() expects rather than widen this module's public types.
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
  catch (err)
    {
      console.log("[v0] Form submission tracking failed:", err);
    }
}

// Records one form-submission event. Never throws — and never lets a slow
// database hold a real form response open indefinitely. The persistence
// attempt may continue after this bounded wait on a warm serverless instance;
// errors are handled inside persistFormSubmission so they cannot become
// unhandled rejections.
export async function recordFormSubmission(record: FormSubmissionRecord): Promise<void>
{
  const db = getClient();
  if (!db)
    {
      console.log("[v0] Form submission tracking skipped: DATABASE_URL is not configured.");
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

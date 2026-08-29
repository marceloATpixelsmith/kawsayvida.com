import postgres from "postgres";

// DURABLE SUBMISSION TRACKING, AT THE SITE OWNER'S EXPLICIT REQUEST. THIS
// DELIBERATELY STORES RAW FIELD VALUES — INCLUDING WHATEVER SENSITIVE OR
// HEALTH INFORMATION A FORM COLLECTS — SO NO SUBMISSION IS EVER SILENTLY
// LOST, EVEN ONES A VISITOR NEVER COMPLETED. RESTRICT DATABASE ACCESS
// ACCORDINGLY; THIS IS NOT A PII-FREE LOG.
// STATIC, HARD-CODED IDENTIFIERS — NEVER INTERPOLATE USER INPUT HERE.

let client: ReturnType<typeof postgres> | null = null;
let tableReady: Promise<void> | null = null;

function getClient(): ReturnType<typeof postgres> | null
{
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString)
    {
      return null;
    }

  if (!client)
    {
      client = postgres(connectionString, { max: 1 });
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

// Records one form-submission event. Never throws — a database outage must
// never break a real form submission, so failures are only logged.
export async function recordFormSubmission(record: FormSubmissionRecord): Promise<void>
{
  const db = getClient();
  if (!db)
    {
      console.log("[v0] Form submission tracking skipped: DATABASE_URL is not configured.");
      return;
    }

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

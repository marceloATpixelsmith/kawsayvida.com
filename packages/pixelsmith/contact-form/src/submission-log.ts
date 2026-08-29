import { recordFormSubmission } from "./submissions";

interface SubmissionLogPayload
{
  form: "contact";
  outcome: "submitted" | "blocked_client_validation";
  complete: boolean;
  fields?: Record<string, string | boolean>;
  lang?: string;
}

const MAX_BODY_BYTES = 24 * 1024;
const MAX_FIELDS = 64;
const MAX_FIELD_NAME_LENGTH = 100;
const MAX_FIELD_VALUE_LENGTH = 5_000;
const MAX_LANG_LENGTH = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_MAX_BUCKETS = 1_000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function hostname(value: string): string
{
  try
    {
      return new URL(value).hostname.toLowerCase();
    }
  catch
    {
      return "";
    }
}

function requestHostname(request: Request): string
{
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || "";
  return (host.split(":")[0] ?? "").toLowerCase();
}

function isSameOriginRequest(request: Request): boolean
{
  const origin = request.headers.get("origin");
  if (!origin)
    {
      return false;
    }

  return hostname(origin) === requestHostname(request);
}

function remoteIp(request: Request): string
{
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function pruneRateLimitBuckets(now: number): void
{
  for (const [bucketKey, bucket] of rateLimitBuckets)
    {
      if (bucket.resetAt <= now)
        {
          rateLimitBuckets.delete(bucketKey);
        }
    }

  while (rateLimitBuckets.size >= RATE_LIMIT_MAX_BUCKETS)
    {
      const oldestKey = rateLimitBuckets.keys().next().value as string | undefined;
      if (!oldestKey)
        {
          break;
        }
      rateLimitBuckets.delete(oldestKey);
    }
}

function isRateLimited(request: Request): boolean
{
  const now = Date.now();
  const key = remoteIp(request);
  const existing = rateLimitBuckets.get(key);

  if (!existing || existing.resetAt <= now)
    {
      pruneRateLimitBuckets(now);
      rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return false;
    }

  existing.count += 1;
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

function isValidFields(value: unknown): boolean
{
  if (value === undefined)
    {
      return true;
    }
  if (!value || typeof value !== "object" || Array.isArray(value))
    {
      return false;
    }

  const entries = Object.entries(value);
  if (entries.length > MAX_FIELDS)
    {
      return false;
    }

  return entries.every(([key, fieldValue]) =>
    key.length > 0
    && key.length <= MAX_FIELD_NAME_LENGTH
    && (typeof fieldValue === "boolean"
      || (typeof fieldValue === "string" && fieldValue.length <= MAX_FIELD_VALUE_LENGTH)));
}

function isValidPayload(value: unknown): value is SubmissionLogPayload
{
  if (!value || typeof value !== "object" || Array.isArray(value))
    {
      return false;
    }

  const payload = value as Record<string, unknown>;
  const allowedKeys = new Set(["form", "outcome", "complete", "fields", "lang"]);
  if (Object.keys(payload).some((key) => !allowedKeys.has(key)))
    {
      return false;
    }

  return payload.form === "contact"
    && (payload.outcome === "submitted" || payload.outcome === "blocked_client_validation")
    && typeof payload.complete === "boolean"
    && isValidFields(payload.fields)
    && (payload.lang === undefined
      || (typeof payload.lang === "string" && payload.lang.length <= MAX_LANG_LENGTH));
}

async function readPayload(request: Request): Promise<unknown>
{
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES)
    {
      return null;
    }

  if (!request.body)
    {
      return null;
    }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try
    {
      while (true)
        {
          const { done, value } = await reader.read();
          if (done)
            {
              break;
            }
          if (!value)
            {
              continue;
            }

          total += value.byteLength;
          if (total > MAX_BODY_BYTES)
            {
              await reader.cancel();
              return null;
            }
          chunks.push(value);
        }
    }
  catch
    {
      return null;
    }

  if (total === 0)
    {
      return null;
    }

  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks)
    {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }

  try
    {
      return JSON.parse(new TextDecoder().decode(combined)) as unknown;
    }
  catch
    {
      return null;
    }
}

// SECURE CLIENT-ATTEMPT LOGGING ENDPOINT. THIS ENDPOINT IS INTENTIONALLY
// SEPARATE FROM THE REAL CONTACT SUBMISSION HANDLER BECAUSE IT MUST RECORD
// CLIENT-SIDE VALIDATION FAILURES THAT NEVER REACH /API/CONTACT. THE INPUT
// SURFACE IS THEREFORE STRICTLY CONSTRAINED AND FAILS CLOSED FOR CROSS-ORIGIN
// OR ABUSIVE REQUESTS WHILE DATABASE FAILURES STILL FAIL OPEN INSIDE THE
// PERSISTENCE LAYER.
export function createSecureSubmissionLogHandler()
{
  return async function POST(request: Request): Promise<Response>
    {
      if (!isSameOriginRequest(request))
        {
          return Response.json({ ok: false }, { status: 403 });
        }

      if (isRateLimited(request))
        {
          return Response.json({ ok: false }, {
            status: 429,
            headers: { "Retry-After": "60" },
          });
        }

      const body = await readPayload(request);
      if (!isValidPayload(body))
        {
          return Response.json({ ok: false }, { status: 400 });
        }

      await recordFormSubmission({
        site: requestHostname(request) || "unknown",
        form: "contact",
        stage: "client_attempt",
        outcome: body.outcome,
        complete: body.complete,
        fields: body.fields,
        ip: remoteIp(request),
        userAgent: request.headers.get("user-agent") ?? undefined,
        referer: request.headers.get("referer") ?? undefined,
        lang: body.lang,
      });

      return Response.json({ ok: true });
    };
}

import type {
  ContactFieldDefinition,
  ContactFormMessages,
  ContactFormPayload,
  ContactSubmissionResult,
} from "./types.js";
import { isContactFieldVisible, validateContactFields } from "./validation.js";

export interface ContactHandlerConfig
{
  fields: readonly ContactFieldDefinition[];
  to: string | readonly string[];
  subject: string | ((values: Record<string, string | boolean>) => string);
  fromName?: string;
  replyToField?: string;
  messages?: ContactFormMessages;
  allowedOrigins?: readonly string[];
  maxBodyBytes?: number;
}

interface TurnstileVerificationResponse
{
  success: boolean;
  "error-codes"?: string[];
}

function escapeHtml(value: string): string
{
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeEmailList(value: string | readonly string[]): { email: string }[]
{
  const addresses = Array.isArray(value) ? value : [value];
  return addresses.map((email) => ({ email }));
}

function isValidPayload(value: unknown): value is ContactFormPayload
{
  if (!value || typeof value !== "object")
    {
      return false;
    }

  const candidate = value as Partial<ContactFormPayload>;
  return Boolean(
    candidate.fields
    && typeof candidate.fields === "object"
    && typeof candidate.turnstileToken === "string"
    && (candidate.honeypot === undefined || typeof candidate.honeypot === "string"),
  );
}

async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean>
{
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret)
    {
      throw new Error("TURNSTILE_SECRET_KEY is not configured.");
    }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp)
    {
      body.set("remoteip", remoteIp);
    }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!response.ok)
    {
      return false;
    }

  const result = await response.json() as TurnstileVerificationResponse;
  return result.success === true;
}

function renderEmailHtml(
  fields: readonly ContactFieldDefinition[],
  values: Record<string, string | boolean>,
): string
{
  const rows = fields
    .filter((field) => field.type !== "hidden" && isContactFieldVisible(field, values))
    .map((field) => {
      const rawValue = values[field.name];
      const printable = typeof rawValue === "boolean" ? (rawValue ? "Yes" : "No") : String(rawValue ?? "");
      return `<tr><th align="left" valign="top" style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(field.label)}</th><td style="padding:8px;border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(printable)}</td></tr>`;
    })
    .join("");

  return `<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows}</table>`;
}

async function sendWithBrevo(
  config: ContactHandlerConfig,
  values: Record<string, string | boolean>,
): Promise<boolean>
{
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  if (!apiKey)
    {
      throw new Error("BREVO_API_KEY is not configured.");
    }
  if (!fromEmail)
    {
      throw new Error("BREVO_FROM_EMAIL is not configured.");
    }

  const subject = typeof config.subject === "function" ? config.subject(values) : config.subject;
  const replyToValue = config.replyToField ? values[config.replyToField] : undefined;
  const replyTo = typeof replyToValue === "string" && replyToValue.includes("@")
    ? { email: replyToValue }
    : undefined;

  const payload = {
    sender: {
      email: fromEmail,
      name: config.fromName ?? "Website Contact Form",
    },
    to: normalizeEmailList(config.to),
    subject,
    htmlContent: renderEmailHtml(config.fields, values),
    ...(replyTo ? { replyTo } : {}),
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return response.ok;
}

export function createContactHandler(config: ContactHandlerConfig)
{
  const knownFields = new Set(config.fields.map((field) => field.name));

  return async function POST(request: Request): Promise<Response>
    {
      const maxBodyBytes = config.maxBodyBytes ?? 64 * 1024;
      const contentLength = Number(request.headers.get("content-length") ?? "0");
      if (Number.isFinite(contentLength) && contentLength > maxBodyBytes)
        {
          return Response.json({ ok: false, message: "Request is too large." } satisfies ContactSubmissionResult, { status: 413 });
        }

      if (config.allowedOrigins?.length)
        {
          const origin = request.headers.get("origin");
          if (!origin || !config.allowedOrigins.includes(origin))
            {
              return Response.json({ ok: false, message: "Origin is not allowed." } satisfies ContactSubmissionResult, { status: 403 });
            }
        }

      let payload: unknown;
      try
        {
          payload = await request.json();
        }
      catch
        {
          return Response.json({ ok: false, message: "Invalid request." } satisfies ContactSubmissionResult, { status: 400 });
        }

      if (!isValidPayload(payload))
        {
          return Response.json({ ok: false, message: "Invalid request." } satisfies ContactSubmissionResult, { status: 400 });
        }

      if (payload.honeypot)
        {
          return Response.json({ ok: true } satisfies ContactSubmissionResult);
        }

      const values: Record<string, string | boolean> = {};
      for (const [key, value] of Object.entries(payload.fields))
        {
          if (!knownFields.has(key) || (typeof value !== "string" && typeof value !== "boolean"))
            {
              continue;
            }
          values[key] = typeof value === "string" ? value.trim() : value;
        }

      const fieldErrors = validateContactFields(config.fields, values, config.messages);
      if (Object.keys(fieldErrors).length)
        {
          return Response.json({ ok: false, fieldErrors } satisfies ContactSubmissionResult, { status: 422 });
        }

      if (!payload.turnstileToken)
        {
          return Response.json({ ok: false, message: config.messages?.turnstileMessage ?? "Security verification is required." } satisfies ContactSubmissionResult, { status: 400 });
        }

      const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
      const turnstileValid = await verifyTurnstile(payload.turnstileToken, forwardedFor);
      if (!turnstileValid)
        {
          return Response.json({ ok: false, message: config.messages?.turnstileMessage ?? "Security verification failed." } satisfies ContactSubmissionResult, { status: 400 });
        }

      const sent = await sendWithBrevo(config, values);
      if (!sent)
        {
          return Response.json({ ok: false, message: config.messages?.errorMessage ?? "There was a problem sending your message." } satisfies ContactSubmissionResult, { status: 502 });
        }

      return Response.json({ ok: true, message: config.messages?.successMessage } satisfies ContactSubmissionResult);
    };
}

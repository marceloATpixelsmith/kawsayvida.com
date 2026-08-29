# @pixelsmith/contact-form

Shared contact-form rendering, browser/server validation, Cloudflare Turnstile protection, and Brevo transactional-email handling for Pixelsmith Next.js sites.

Read `../../AGENT_INTEGRATION.md` before integrating this package.

## Automatic package standards

Do not ask the user to choose these unless they explicitly request a different integration:

- the same field schema drives client and server validation;
- server-side validation remains authoritative;
- Cloudflare Turnstile is required on public forms;
- Turnstile is verified server-side before protected processing;
- long forms place Turnstile at the top according to the shared threshold;
- honeypot spam protection;
- field allowlisting;
- request-size protection;
- safe escaping before values enter HTML email;
- accessible labels/help/errors/status UI;
- Brevo transactional email unless the user explicitly selects another service;
- the fixed environment-variable names below.

Required env names:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
BREVO_API_KEY
BREVO_FROM_EMAIL
```

Optional env name, for durable submission tracking (see below):

```text
DATABASE_URL
```

The names are standardized. Their secret values must never be invented or committed.

## Agent intake checklist

### Infer automatically before asking

For an existing form/site, inspect and determine when possible:

- all current fields and their order;
- field types;
- required/optional status;
- labels, placeholders, help text, and option values;
- current validation rules;
- current recipient address(es);
- email subject and sender display name;
- reply-to field;
- success/error copy;
- form layout and visual treatment;
- whether the form has uploads or unusual field semantics;
- existing Turnstile/Brevo env documentation;
- any route/action/API currently handling the form.

If the task is to preserve an existing form, reuse those established facts rather than asking the user to restate them.

### Ask the user if still unknown and required

For a new form, or when a required business decision is not established, ask:

- What fields should the form contain, in what order, and which are required?
- What should each field's label/options be?
- Which email address or addresses should receive submissions?
- What email subject should Brevo use?
- What sender display name should appear?
- Which field should be used as Reply-To, normally the submitter's email?
- What success message should the user see?
- Are there any business-specific validation rules beyond ordinary field semantics?
- If there are uploads, what file types and maximum sizes are allowed?
- If the visual layout is not established by an existing design, should fields be single-column or grouped into rows on larger screens?

Ask only for decisions that cannot be inferred safely.

### Validation rules agents may infer

When field semantics are clear, agents should apply sensible standard validation without asking unnecessary questions, such as:

- valid email syntax for email fields;
- sensible telephone input handling;
- valid URL syntax for URL fields;
- required selection for required select/radio fields;
- numeric/date constraints explicitly supplied by the form schema;
- configured file type/size rules for uploads.

If a business rule is ambiguous, ask instead of inventing it. Examples: minimum age, allowed geographic regions, eligibility rules, required consent wording, or medical/business screening logic.

### Visual configuration

The package owns consistent field/error/status structure, but the consuming site should map the form to its established brand.

Infer existing typography, colors, border/radius treatment, spacing, and button styling from the target site. For a new site with no established form design, ask only for unresolved visual decisions that materially affect the design.

### Never assume

Do not invent:

- recipient addresses;
- sender addresses or secret values;
- form fields or consent language;
- required status;
- business eligibility rules;
- file restrictions;
- legal/privacy text;
- success/error wording when content requirements are material and not supplied;
- an alternate email provider without being asked.

## Durable submission tracking (optional, Postgres-backed)

At a site owner's explicit request, this package can record **every** form submission attempt to Postgres — including incomplete ones that never passed client-side validation, and including the full, unredacted field values — so a submission is never silently lost. This is deliberately **not** a PII-free log: if a form collects sensitive or health information, that information is stored as submitted. Restrict database access accordingly, and only enable this when the site owner has explicitly asked for it.

Set `DATABASE_URL` to enable it (any standard Postgres connection string — the package uses the `postgres` npm client directly, not a Vercel-specific env var). When unset, tracking is silently skipped and the form behaves exactly as without it — a database outage or missing config never blocks a real submission.

Data lands in a dedicated schema so it doesn't collide with a site's other tables: `pixelsmithforms.form_submissions` (created automatically on first use). Each row records: which site (from the request's `Host` header), which form, the stage (`client_attempt` — a submit click the browser saw, may never have reached the server — vs. `server_processed`), the outcome code, whether the submission was complete/validated, the raw field values, whether the notification email was confirmed sent and to whom, the email provider's own message ID as proof of acceptance, and the visitor's IP/user-agent/referer/language.

Two pieces wire it up:

- **`createContactHandler`** (server) records every outcome automatically — no config needed beyond `DATABASE_URL`.
- **`<ContactForm submissionLogEndpoint="/api/your-route" />`** (client) fires a beacon on every submit click, including ones blocked by client-side validation, so incomplete attempts are captured too. Mount `createSubmissionLogHandler()` at that route:

```ts
// app/api/form-log/route.ts
import { createSubmissionLogHandler } from '@pixelsmith/contact-form/server'

export const POST = createSubmissionLogHandler()
```

Any other form on the same site (even one not built with this package, like a bespoke Server Action) can reuse the same route and the same `recordFormSubmission` function directly — see its JSDoc in `src/submissions.ts` for the record shape.

## Identity in console logs (optional)

Separately from Postgres tracking, pass `identityFields` to `createContactHandler`'s config (e.g. `{ name: ["firstName", "lastName"], email: "email" }`) to include the submitter's own name/email in the server's plain-text `[v0]` console logs on every outcome — useful for a quick human scan without opening the database. Unset by default.

## Typical server route

```ts
import { createContactHandler } from '@pixelsmith/contact-form/server'
import { contactFields } from '@/lib/contact-fields'

export const POST = createContactHandler({
  fields: contactFields,
  to: 'recipient@example.com',
  subject: 'Website contact form',
  replyToField: 'email',
})
```

By default `createContactHandler` always adds a maintainer notification address (`PIXELSMITH_NOTIFICATION_EMAIL` in `server.ts`) as an extra silent recipient on top of `to`. Pass `includePixelsmithNotificationRecipient: false` in the config when a site's recipient list must be exactly `to` and nothing else.

## Post-install verification

Verify:

- every field renders with correct label/options/order;
- required and semantic validation works client-side;
- the same invalid payload is rejected server-side;
- Turnstile prevents processing when missing/invalid/expired;
- Turnstile placement is correct for short versus long forms;
- Brevo uses `BREVO_FROM_EMAIL` and the configured recipient/subject;
- Reply-To points to the intended submitter field;
- successful submission and email-send failures are not falsely conflated;
- error messages do not leak sensitive server details;
- desktop and mobile layouts are usable and accessible;
- keyboard navigation/focus states work;
- old form handlers, duplicate Turnstile widgets, or legacy mail code are removed when replaced;
- `.env.example` documents required names without containing real secrets.

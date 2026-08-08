# Repository Instructions for Codex

These instructions are the shared default for repositories owned by this account. Follow more-specific repository or task instructions when they exist. More deeply nested `AGENTS.md` files may define narrower rules for their directory trees.

## First: inspect the repository

- Do not assume every repository uses the same stack. Inspect `package.json`, lockfiles, `app/`, `pages/`, `src/`, config files, existing components, data files, environment examples, and relevant documentation before making changes.
- Preserve the existing architecture unless the task explicitly calls for a migration, modernization, or architectural change.
- Never replace a working approach merely because another approach is newer.
- For bug fixes, identify the underlying cause before changing code. Avoid symptom-only patches when the root cause can be fixed safely.
- Before editing a shared component, utility, provider, layout, configuration object, or data structure, inspect where it is used.

## Pixelsmith shared website core

For standard Next.js client websites, shared cross-site functionality should come from `marceloATpixelsmith/pixelsith-website-core` when an applicable package exists rather than being independently reimplemented in the site.

Current shared systems include:

- `@pixelsmith/localization`
- `@pixelsmith/site-menu`
- `@pixelsmith/ecwid-store`
- `@pixelsmith/contact-form`

When creating a new site or modifying functionality covered by one of these packages:

- inspect the target repository first and determine what is already established by its code, design, content, routes, and environment documentation;
- consult `pixelsith-website-core/AGENT_INTEGRATION.md` plus the applicable package README/intake documentation before implementation;
- use package-standard behavior and environment-variable names automatically rather than asking the user to choose standardized details again;
- identify site-specific inputs that remain unresolved and ask the user only for those decisions;
- never invent store IDs, category IDs, routes, recipients, languages, menu destinations, brand values, search terms, business rules, or secret values;
- for an existing site, infer and preserve established branding, URLs, content, and intended behavior unless the task explicitly changes them;
- for a new site with no design/source establishing a configurable visual choice, ask for the missing visual decision rather than copying another client's branding;
- use the package's documented props, CSS variables, slots, and extension points instead of forking shared package code for ordinary site-specific styling;
- if a reusable requirement cannot be represented by the current shared package, improve the shared package when appropriate rather than creating a divergent private implementation in one site;
- complete the package-specific post-install verification checklist before considering the integration finished.

Canonical reference sites are implementation references only. Do not copy their site-specific identifiers, content, URLs, credentials, or branding into another project.

## Canonical web stack

For new websites, migrations to the standard stack, substantial new sections, or modernization work where a technology choice is actually required, use this baseline unless the repository has a justified project-specific requirement:

- Next.js 16 with the App Router
- React 19
- TypeScript with strict type checking
- Tailwind CSS 4
- shadcn/ui where appropriate
- Base UI where appropriate
- Lucide React for interface icons
- `class-variance-authority`, `clsx`, and `tailwind-merge` for component variants and class composition where needed
- Vercel Analytics where analytics is already part of the project or explicitly requested
- pnpm as the package manager for the standard stack
- Vercel-compatible deployment

Do not perform a major dependency or framework upgrade as a side effect of an unrelated task. If an existing project uses an older but functioning Next.js/React/Tailwind version, preserve it unless the task requires modernization.

## Next.js and React conventions

- Prefer the App Router for new Next.js work.
- Use Server Components by default. Add `use client` only when browser APIs, state, effects, event handlers, or client-only libraries require it.
- Keep client boundaries as small as practical.
- Use Next.js routing and metadata APIs rather than recreating them manually.
- Use `next/image` for site imagery when appropriate and preserve correct aspect ratios, responsive sizing, and meaningful alt text.
- Use `next/font` for web fonts when practical.
- Preserve or improve page metadata, canonical URLs, Open Graph metadata, social images, manifests, favicons, and other SEO-related configuration when touching page architecture.
- Maintain semantic HTML, keyboard accessibility, visible focus states, and sensible ARIA usage.
- Do not introduce hydration workarounds when the actual server/client rendering mismatch can be corrected.

## Project organization

- Prefer reusable components over duplicated markup.
- Keep components focused. Do not turn a page or layout into a monolithic component when responsibilities can be separated cleanly.
- Keep site-wide configuration in centralized configuration modules when that matches the project.
- Keep repeating editable content in structured data such as JSON when appropriate instead of hard-coding repeated content into presentation components.
- Use typed wrappers or TypeScript types for structured content.
- Keep integrations with external services behind dedicated modules, providers, adapters, actions, or API routes rather than scattering service-specific logic throughout UI components.
- Follow existing `@/*` import aliases when configured.
- Preserve existing file naming and directory conventions.

## Styling and visual fidelity

- Preserve the existing visual design unless a redesign is explicitly requested.
- When recreating or migrating an existing website, visual and behavioral fidelity to the source takes priority over arbitrary modernization.
- Maintain responsive behavior across desktop, tablet, and mobile breakpoints.
- Reuse the project's existing design tokens, Tailwind utilities, CSS variables, typography, spacing, and component patterns before adding new ones.
- Do not introduce a second styling system when the current one can implement the requested result.
- Avoid unnecessary one-off inline styles when existing CSS/Tailwind patterns are appropriate.

## Internationalization, language switching, and content

- Preserve the repository's existing language architecture.
- For bilingual sites, keep Spanish and English content synchronized when the task affects both languages.
- Do not hard-code translated strings into components when the project already has an i18n layer or centralized translation data.
- Preserve locale-aware routes, language toggles, metadata, and navigation behavior.
- For new bilingual sites or migrations to the standard stack, use `@pixelsmith/localization` and the same overall localization architecture represented by the canonical reference sites `zaxic.mx`, `terapiassonoras.com`, `gelectro.com`, `kawsayvida.com`, and `ameyalli.space` unless the task explicitly requires something different.
- The language-switcher UI should remain visually and behaviorally consistent with the shared package across desktop and mobile. Before implementing or changing it, inspect the current shared package/reference implementation rather than recreating the behavior from memory.
- Keep language state, translated UI text, navigation labels, page copy, metadata, and locale-sensitive behavior centralized and predictable rather than scattering language conditionals throughout components.

## Ecwid storefront standard

When creating a new site that uses Ecwid, or migrating an Ecwid storefront to the standard stack, use `@pixelsmith/ecwid-store` with `zaxic.mx` as the canonical implementation reference unless the task explicitly specifies otherwise.

- Read the Ecwid package README and `AGENT_INTAKE.md` before implementation and gather unresolved site-specific inputs as directed there.
- Match the shared Ecwid integration architecture, including storefront UI behavior, cart-related UI, product/category navigation behavior, search experience, and category megamenu behavior.
- The site-wide search should use the shared dedicated search UI rather than allowing an inconsistent inline Ecwid search experience to become the primary site search.
- Category navigation and the megamenu should use the shared dynamic category-driven approach, including appropriate filtering, ordering, localization, and responsive behavior.
- Preserve clean site URLs and the site's own visual design around Ecwid rather than exposing raw/default Ecwid UI when the shared implementation already provides an integrated site experience.
- Use these environment variable names consistently for Ecwid credentials:
  - `ECWID_API_KEY`
  - `ECWID_CLIENT_SECRET`
- Keep both Ecwid credentials server-only unless a specific Ecwid API requirement explicitly requires otherwise.
- Do not copy hard-coded store IDs, category IDs, credentials, product data, route words, search terms, or site-specific values from `zaxic.mx`.
- If the current shared package or `zaxic.mx` implementation has evolved since these instructions were written, inspect the current source rather than relying on memory.

## Forms, validation, spam protection, and notifications

Unless a task explicitly requires a different setup, use `@pixelsmith/contact-form` for public-facing contact forms and follow its package intake checklist.

### Turnstile

- Use Cloudflare Turnstile for bot protection on public-facing forms.
- Use these environment variable names consistently:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- The site key is client-visible by design; the secret key must remain server-only.
- Verify Turnstile server-side before accepting or processing a protected submission. Do not rely only on the client widget state.
- Fail safely when Turnstile verification is missing, invalid, expired, or unsuccessful.

### Validation

- Implement clear user-facing client-side validation for usability and immediate feedback.
- Independently validate the same submission on the server. Never trust client-side validation as a security boundary.
- Validation rules must match the meaning of each field. Examples include valid email syntax for email fields, sensible length and format constraints for phone numbers, required-choice enforcement for selects/radios, and appropriate size/type limits for uploads when applicable.
- Normalize and sanitize data where appropriate before use, storage, or inclusion in notifications.
- Validation errors shown to users should be specific and actionable without exposing sensitive server details.
- If the correct validation rule for a field is genuinely ambiguous and cannot be determined from the surrounding code, content, or task requirements, ask the user rather than inventing a business rule.

### Brevo transactional email

- Unless another notification service is explicitly requested, use Brevo transactional email for form notifications.
- Use these shared Vercel environment variable names:
  - `BREVO_API_KEY`
  - `BREVO_FROM_EMAIL`
- Keep `BREVO_API_KEY` server-only.
- Do not hard-code sender addresses, API keys, or credentials in the repository.
- Keep Brevo-specific request logic in a dedicated server-side module, action, or API layer rather than embedding it directly into presentation components.
- Treat a successful form submission and a successful notification send as separate concerns when appropriate. Return useful failure states and do not falsely report email delivery if the Brevo request failed.

## Standard external-service environment variables

- When a project uses OpenAI, always use `OPENAI_API_KEY` for the API key unless the task explicitly requires a different integration contract.
- Keep `OPENAI_API_KEY` server-only. Never expose it through a `NEXT_PUBLIC_` variable or client-side bundle.
- Reuse the standardized environment-variable names defined in these instructions rather than introducing project-specific aliases for the same services.

## Dependencies and package management

- Inspect the lockfile before running package commands.
- When `pnpm-lock.yaml` exists, use pnpm and do not generate npm or Yarn lockfiles.
- For the standard stack and new projects, prefer pnpm.
- Do not add a dependency when the existing framework or installed packages can solve the problem cleanly.
- Do not remove or upgrade unrelated dependencies while completing a focused task.
- If a dependency change is required, make the smallest justified change and update the existing lockfile.

## Data, APIs, environment variables, and external services

- Never invent API endpoints, credentials, database schemas, environment-variable names, webhook behavior, or external-service responses.
- Inspect existing code and `.env.example`-style files before using environment variables.
- Never commit secrets, tokens, passwords, private keys, or production credentials.
- Preserve existing integrations such as Stripe, Supabase, Ecwid, Brevo, analytics, CRM systems, or other services unless the task explicitly changes them.
- When an external service is unavailable from the execution environment, do not fake successful verification. Validate everything that can be validated locally and state what could not be verified.
- Treat user-provided or remote data as untrusted input. Validate and sanitize where appropriate.

## Code quality and safety

- Prefer clear, maintainable code over clever abstractions.
- Preserve existing variable and public API names unless changing them is necessary for the task.
- Use TypeScript types instead of weakening type safety with `any` unless there is a specific, documented reason.
- Do not disable lint, TypeScript, security, or framework checks merely to make a failure disappear.
- Do not use broad `eslint-disable`, `@ts-ignore`, or similar suppression unless the underlying issue genuinely cannot be addressed more correctly.
- Apply appropriate input validation, authorization, escaping, and security controls for user-facing or server-side functionality.
- Do not expose server-only values to client components.
- Avoid destructive data operations unless explicitly requested.

## Comments and delivered code

- When adding code comments, write them in ALL CAPS immediately after the comment marker, for example `//VALIDATE THE INPUT BEFORE SUBMITTING`.
- Comments should explain non-obvious intent, constraints, or behavior rather than restating obvious code.
- When asked to provide code in a response, provide complete usable code rather than omitted sections or placeholder fragments.

## Validation before completion

Inspect `package.json` and repository documentation to determine which checks actually exist. Run the applicable checks after all code changes have been made. Prefer this order when available:

1. Tests relevant to the changed code
2. Type checking
3. Linting
4. Production build

Typical commands may include:

- `pnpm test`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm build`

Do not assume all four scripts exist.

- Fix failures caused by your changes and rerun the affected checks.
- Do not suppress failures merely to obtain a green result.
- If an existing unrelated failure prevents a clean validation run, distinguish it clearly from failures introduced by the task.
- For UI changes, inspect the affected pages at relevant responsive sizes when browser or screenshot tooling is available.

## Git and patch discipline

- Keep changes limited to the requested task.
- Review `git diff` and `git status` before finishing.
- Do not rewrite unrelated files simply to reformat or modernize them.
- Do not modify or amend existing commits unless explicitly instructed.
- Do not force-push or rewrite history unless explicitly instructed.
- Do not modify generated deployment state or production configuration unless the task requires it.
- Before finishing, check for accidental changes, secrets, generated junk, duplicate lockfiles, and unrelated formatting churn.
- When the environment/task expects committed work, ensure the intended files are committed and the worktree state is understood. Do not claim a commit or push occurred unless it actually did.

## Working in the Codex cloud environment

- Codex may run in a sandbox with limited filesystem permissions, network access, credentials, browser capabilities, or external-service access. Use only capabilities actually available in the current task environment.
- Do not assume access to the user's local machine, Vercel account, production databases, third-party dashboards, or secrets merely because the repository references them.
- When a task depends on unavailable external access, complete and validate the repository-side work that can be done safely, then identify the specific unverified dependency.
- Never fabricate command output, build success, deployment success, API responses, screenshots, or external-service verification.
- Prefer repository-local commands and deterministic checks over assumptions.

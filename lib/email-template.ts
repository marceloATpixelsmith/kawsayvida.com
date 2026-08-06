// ---------------------------------------------------------------------------
// Shared HTML/plain-text builders for outbound notification emails (contact
// + registration forms). Keeps the branded look and section/row layout in
// one place instead of duplicated inline strings in each server action.
// ---------------------------------------------------------------------------

const BRAND_GREEN = '#026634'
const TEXT_DARK = '#1f2a22'
const TEXT_MUTED = '#5b5b5b'
const BORDER = '#e2e5df'
const BG_PAGE = '#f5f6f2'
const BG_CARD = '#ffffff'
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = 'Helvetica, Arial, sans-serif'

export type EmailRow = { label: string; value: string }

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderRow(row: EmailRow): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${BORDER};">
        <div style="font-family:${SANS};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_GREEN};font-weight:700;">${escapeHtml(row.label)}</div>
        <div style="margin-top:4px;font-family:${SANS};font-size:14px;line-height:1.5;color:${TEXT_DARK};white-space:pre-wrap;">${escapeHtml(row.value)}</div>
      </td>
    </tr>`
}

// Renders a flat table of label/value rows, no section title bar — for a
// single-section email where the shell's own heading is enough (e.g. the
// simple contact form). Rows with an empty value are skipped.
export function renderRows(rows: EmailRow[]): string {
  const visibleRows = rows.filter((r) => r.value.trim().length > 0)
  if (visibleRows.length === 0) return ''
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${visibleRows.map(renderRow).join('')}
    </table>`
}

// Renders a titled section of label/value rows. Rows with an empty value are
// skipped, and the whole section is omitted if nothing in it has a value.
export function renderSection(title: string, rows: EmailRow[]): string {
  const visibleRows = rows.filter((r) => r.value.trim().length > 0)
  if (visibleRows.length === 0) return ''
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="font-family:${SERIF};font-size:18px;font-weight:400;color:${TEXT_DARK};padding-bottom:8px;border-bottom:2px solid ${BRAND_GREEN};">
          ${escapeHtml(title)}
        </td>
      </tr>
      ${visibleRows.map(renderRow).join('')}
    </table>`
}

export function renderTextRows(rows: EmailRow[]): string {
  const visibleRows = rows.filter((r) => r.value.trim().length > 0)
  if (visibleRows.length === 0) return ''
  return `${visibleRows.map((r) => `${r.label}: ${r.value}\n`).join('')}\n`
}

export function renderTextSection(title: string, rows: EmailRow[]): string {
  const visibleRows = rows.filter((r) => r.value.trim().length > 0)
  if (visibleRows.length === 0) return ''
  return `${title.toUpperCase()}\n${visibleRows.map((r) => `${r.label}: ${r.value}\n`).join('')}\n`
}

export function renderEmailShell(opts: {
  preheader: string
  heading: string
  bodyHtml: string
  footerText: string
}): string {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background-color:${BG_PAGE};">
    <span style="display:none;font-size:1px;color:${BG_PAGE};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(opts.preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_PAGE};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${BG_CARD};border:1px solid ${BORDER};">
            <tr>
              <td style="background-color:${BRAND_GREEN};padding:22px 32px;">
                <div style="font-family:${SERIF};font-size:20px;color:#ffffff;letter-spacing:0.02em;">kawsayvida.com</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 4px;">
                <div style="font-family:${SERIF};font-size:24px;color:${TEXT_DARK};">${escapeHtml(opts.heading)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;">
                ${opts.bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 26px;border-top:1px solid ${BORDER};">
                <div style="font-family:${SANS};font-size:12px;color:${TEXT_MUTED};">${escapeHtml(opts.footerText)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

type TurnstileResponse = {
  success: boolean
  'error-codes'?: string[]
}

// Verifies a Cloudflare Turnstile token server-side. Shared by every form
// action (contact, registration) so the verification logic lives in one place.
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.log('[v0] Turnstile secret (TURNSTILE_SECRET_KEY) is not configured on the server.')
    return false
  }

  const body = new URLSearchParams()
  body.append('secret', secretKey)
  body.append('response', token)

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      console.log('[v0] Turnstile verification request failed:', response.status)
      return false
    }

    const result = (await response.json()) as TurnstileResponse

    if (!result || typeof result.success !== 'boolean') {
      console.log('[v0] Turnstile verification returned malformed data.')
      return false
    }

    if (!result.success) {
      console.log('[v0] Turnstile verification failed:', result['error-codes'])
    }

    return result.success
  } catch (err) {
    console.log('[v0] Turnstile verification exception:', err)
    return false
  }
}

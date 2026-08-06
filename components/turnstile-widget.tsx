'use client'

import Script from 'next/script'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export type TurnstileWidgetHandle = {
  reset: () => void
}

type TurnstileWidgetProps = {
  siteKey: string
  action: string
  onVerify: (token: string) => void
  onExpire: () => void
  label: string
  loadingText: string
  loadErrorText: string
}

// Cloudflare Turnstile's "implicit" render (scanning the DOM for a
// `cf-turnstile` class once the script tag loads) is unreliable in a Next.js
// app: it can miss the widget entirely on client-side navigation (the script
// is already cached, so next/script's onLoad never fires again) or on a slow
// connection, and it fails completely silently — the visitor gets no
// indication anything is wrong until they submit. This renders the widget
// explicitly instead, with real load-detection and a visible loading/error
// state so a failure is obvious immediately, not after filling out a long
// form.
export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ siteKey, action, onVerify, onExpire, label, loadingText, loadErrorText }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current)
      },
    }))

    useEffect(() => {
      let cancelled = false
      let pollId: ReturnType<typeof setInterval>
      let timeoutId: ReturnType<typeof setTimeout>

      function tryRender() {
        if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile) return
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action,
            callback: (token: string) => onVerify(token),
            'expired-callback': () => onExpire(),
            'error-callback': () => onExpire(),
          })
          setStatus('ready')
          clearInterval(pollId)
          clearTimeout(timeoutId)
        } catch {
          setStatus('error')
        }
      }

      // Poll for window.turnstile rather than relying solely on the Script
      // component's onLoad — onLoad won't fire again if the script was
      // already loaded by a previous page during client-side navigation.
      pollId = setInterval(tryRender, 150)
      tryRender()

      // If the script never loads at all (blocked by an ad/content blocker,
      // network issue, etc.), surface that clearly instead of leaving the
      // form silently unsubmittable.
      timeoutId = setTimeout(() => {
        if (!widgetIdRef.current) setStatus('error')
      }, 9000)

      return () => {
        cancelled = true
        clearInterval(pollId)
        clearTimeout(timeoutId)
        if (widgetIdRef.current) {
          window.turnstile?.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey, action])

    return (
      <div>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-primary">{label}</p>
        <div ref={containerRef} />
        {status === 'loading' && <p className="mt-2 text-sm text-muted-foreground">{loadingText}</p>}
        {status === 'error' && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {loadErrorText}
          </p>
        )}
      </div>
    )
  },
)

import { cn } from '@/lib/utils'

// The official Ameyalli horizontal logo (includes the "AMEYALLI" wordmark).
// The source SVG paths are dark, so we invert them to a warm cream for use
// on the site's dark backgrounds. To replace the logo, drop a new file at
// /public/images/ameyalli-logo.svg (or update the src below).
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/ameyalli-logo.svg"
      alt="Ameyalli"
      className={cn('h-8 w-auto', className)}
      style={{ filter: 'brightness(0) invert(0.95) sepia(0.12) saturate(1.4)' }}
    />
  )
}

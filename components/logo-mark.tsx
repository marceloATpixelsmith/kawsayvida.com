import { cn } from '@/lib/utils'

// The official kawsayvida.com logo (full color, from the original site).
// To replace the logo, drop a new file at /public/images/kawsayvida-logo.png
// (or update the src below).
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/kawsayvida-logo.png"
      alt="kawsayvida.com"
      className={cn('h-8 w-auto', className)}
    />
  )
}

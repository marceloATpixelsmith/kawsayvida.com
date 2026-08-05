'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type LightboxPhoto = {
  image: string
  alt: string
}

type LightboxProps = {
  photos: LightboxPhoto[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
  labels: {
    close: string
    prev: string
    next: string
  }
}

const SWIPE_THRESHOLD = 50

export function Lightbox({ photos, index, onClose, onIndexChange, labels }: LightboxProps) {
  const touchStartX = useRef<number | null>(null)
  const count = photos.length

  const goTo = useCallback(
    (dir: number) => onIndexChange((index + dir + count) % count),
    [index, count, onIndexChange],
  )

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goTo(-1)
      else if (e.key === 'ArrowRight') goTo(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, goTo])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      goTo(deltaX < 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  const photo = photos[index]
  if (!photo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={labels.close}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-white/80 transition-colors hover:text-white sm:right-6 sm:top-6"
      >
        <X className="h-7 w-7" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          goTo(-1)
        }}
        aria-label={labels.prev}
        className={cn(
          'absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/80 transition-colors hover:text-white sm:flex sm:left-4',
        )}
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          goTo(1)
        }}
        aria-label={labels.next}
        className={cn(
          'absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center text-white/80 transition-colors hover:text-white sm:flex sm:right-4',
        )}
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div
        className="relative h-[85vh] w-[92vw] max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={photo.image}
          src={photo.image}
          alt={photo.alt}
          fill
          sizes="92vw"
          priority
          className="object-contain"
        />
      </div>

      <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-white/60 sm:bottom-6">
        {index + 1} / {count}
      </p>
    </div>
  )
}

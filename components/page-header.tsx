import Image from 'next/image'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  image: string
  alt: string
}

export function PageHeader({ eyebrow, title, image, alt }: PageHeaderProps) {
  return (
    <section className="relative flex h-[52vh] min-h-[360px] w-full items-end overflow-hidden">
      <Image
        src={image || '/placeholder.jpg'}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_25%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/82 via-background/40 to-background/20" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-8 lg:px-10 lg:pb-14">
        {eyebrow ? (
          <p className="mb-4 text-xs uppercase tracking-luxe text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="font-serif text-5xl font-light leading-none text-balance text-foreground sm:text-6xl lg:text-7xl">
          {title}
        </h1>
      </div>
    </section>
  )
}

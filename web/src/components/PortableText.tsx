import { PortableText as PortableTextComponent, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      console.log('Image value:', value) // Debugging log to inspect the value structure
      const { asset, alt } = value
      // This assumes your GROQ query might return a direct URL for the asset, 
      // or you need to use a builder. If it's a reference, you'd need the builder.
      // For now, let's assume we might need a basic asset check.
      const imageUrl = asset?.url || asset?._ref // This depends on how it's queried
      
      if (!imageUrl) return null

      return (
        <div className="relative my-8 h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-80 md:h-96">
          <Image
            src={imageUrl}
            alt={alt || 'Content Image'}
            fill
            className="object-cover"
          />
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-12 text-3xl font-black tracking-tight text-white sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-8 text-xl font-bold tracking-tight text-white sm:text-2xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-4 mt-6 text-lg font-bold tracking-tight text-white sm:text-xl">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-6 text-slate-300 last:mb-0 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-indigo-500 bg-white/5 py-4 pl-6 pr-4 italic text-slate-200 rounded-r-xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc space-y-2 text-slate-300">
        {children}
      </ul>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const { href } = value
      const isExternal = href?.startsWith('http')
      return (
        <Link
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="font-medium text-indigo-400 underline decoration-indigo-500/30 underline-offset-4 transition-colors hover:text-indigo-300 hover:decoration-indigo-400"
        >
          {children}
        </Link>
      )
    },
  },
}

export function PortableText({ value }: { value: any }) {
  return (
    <div className="max-w-none">
      <PortableTextComponent value={value} components={components} />
    </div>
  )
}

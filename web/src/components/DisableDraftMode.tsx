'use client'
import Link from 'next/link'
import { useDraftModeEnvironment } from 'next-sanity/hooks'

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment()
  
  // Only show outside of Presentation Tool (the iframe)
  if (environment !== 'live' && environment !== 'unknown') return null

  return (
    <Link 
      href="/api/draft-mode/disable" 
      className="fixed bottom-4 right-4 z-50 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-all shadow-xl"
    >
      Disable Draft Mode
    </Link>
  )
}

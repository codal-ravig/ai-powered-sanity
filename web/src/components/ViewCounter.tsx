'use client'

import { useEffect, useRef } from 'react'

interface ViewCounterProps {
  id: string
}

export function ViewCounter({ id }: ViewCounterProps) {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    fetch(`/api/views/${id}`, {
      method: 'POST',
    }).catch(console.error)
  }, [id])

  return null
}

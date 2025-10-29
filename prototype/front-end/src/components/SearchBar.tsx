import { useEffect, useState } from 'react'

export function SearchBar({ placeholder, value, onDebouncedChange, delay = 300 }: { placeholder?: string; value?: string; onDebouncedChange: (text: string) => void; delay?: number }) {
  const [text, setText] = useState(value || '')

  useEffect(() => setText(value || ''), [value])

  useEffect(() => {
    const t = setTimeout(() => onDebouncedChange(text), delay)
    return () => clearTimeout(t)
  }, [text, delay, onDebouncedChange])

  return (
    <input className="input" placeholder={placeholder || 'Search…'} value={text} onChange={(e) => setText(e.target.value)} />
  )
}



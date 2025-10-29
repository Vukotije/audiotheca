import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { MusicalWork } from '@/types'
import { Link } from 'react-router-dom'

export function WorksListPage() {
  const [items, setItems] = useState<MusicalWork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/musical-works')
        setItems(data)
        setError(null)
      } catch (e: any) { setError(e.message) }
      finally { setLoading(false) }
    })()
  }, [])

  if (loading) return <div className="container"><div className="card">Loading…</div></div>

  return (
    <div className="container max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Musical Works</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <ul className="divide-y divide-slate-700">
          {items.map(w => (
            <li key={w.id} className="py-2">
              <Link className="hover:underline" to={`/works/${w.id}`}>{w.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


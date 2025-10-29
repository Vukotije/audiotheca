import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { SearchBar } from '@/components/SearchBar'
import { Link } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'

interface SearchResult {
  artists: Array<{ id: number; name: string }>
  musical_works: Array<{ id: number; title: string }>
}

export function SearchPage() {
  const [q, setQ] = useState('')
  const [res, setRes] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const t = setTimeout(async () => {
      if (!q) { setRes(null); return }
      setLoading(true)
      try {
        const { data } = await api.get('/search', { params: { q, type: 'all' }, signal: controller.signal as any })
        setRes(data)
        setError(null)
      } catch (e: any) { setError(e.message) }
      setLoading(false)
    }, 300)
    return () => { clearTimeout(t); controller.abort() }
  }, [q])

  return (
    <div className="container max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Search</h2>
        <SearchBar placeholder="Search artists or works" value={q} onDebouncedChange={setQ} />
        {loading && <div className="text-slate-300 mt-2">Searching…</div>}
        {error && <div className="mt-2"><Alert type="error">{error}</Alert></div>}
        {res && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="card">
              <h3>Artists</h3>
              <ul>
                {res.artists.map(a => <li key={a.id}><Link className="hover:underline" to={`/artists/${a.id}`}>{a.name}</Link></li>)}
              </ul>
            </div>
            <div className="card">
              <h3>Works</h3>
              <ul>
                {res.musical_works.map(w => <li key={w.id}><Link className="hover:underline" to={`/works/${w.id}`}>{w.title}</Link></li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


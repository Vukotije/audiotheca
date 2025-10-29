import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/api/client'
import type { Artist } from '@/types'
import { Alert } from '@/components/ui/Alert'

export function ArtistDetailsPage() {
  const { id } = useParams()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get(`/artists/${id}`); setArtist(data); setError(null) }
      catch (e: any) { setError(e.message) }
    })()
  }, [id])

  if (!artist) return <div className="container"><div className="card">Loading…</div></div>

  return (
    <div className="container max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">{artist.name}</h2>
        {error && <div className="mb-2"><Alert type="error">{error}</Alert></div>}
        {artist.multimedia && (
          <img src={artist.multimedia} alt={artist.name} className="rounded-xl border border-slate-700 mb-3 max-h-72 object-cover" />
        )}
        {artist.biography && <p className="text-slate-300 whitespace-pre-wrap">{artist.biography}</p>}
      </div>
    </div>
  )
}



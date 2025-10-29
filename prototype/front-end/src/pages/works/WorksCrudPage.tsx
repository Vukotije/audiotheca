import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Artist, Genre, MusicalWork } from '@/types'

export function WorksCrudPage() {
  const [items, setItems] = useState<MusicalWork[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [title, setTitle] = useState('')
  const [artistId, setArtistId] = useState<number | ''>('')
  const [genreId, setGenreId] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      const [w, a, g] = await Promise.all([
        api.get('/musical-works'),
        api.get('/artists'),
        api.get('/genres')
      ])
      setItems(w.data); setArtists(a.data); setGenres(g.data); setError(null)
    } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!title || !artistId || !genreId) return
    await api.post('/musical-works', { title, artist_id: artistId, genre_id: genreId, description })
    setTitle(''); setArtistId(''); setGenreId(''); setDescription('')
    load()
  }

  async function update(w: MusicalWork) {
    const newTitle = prompt('New title', w.title)
    if (!newTitle) return
    await api.put(`/musical-works/${w.id}`, { title: newTitle })
    load()
  }

  async function remove(id: number) {
    if (!confirm('Delete work?')) return
    await api.delete(`/musical-works/${id}`)
    load()
  }

  return (
    <div className="container max-w-5xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Works Admin</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="input" value={artistId} onChange={(e) => setArtistId(Number(e.target.value))}>
            <option value="">Artist</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select className="input" value={genreId} onChange={(e) => setGenreId(Number(e.target.value))}>
            <option value="">Genre</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input className="input md:col-span-1" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn-primary" onClick={create}>Add</button>
        </div>
        <ul className="divide-y divide-slate-700">
          {items.map(w => (
            <li key={w.id} className="py-2 flex items-center justify-between">
              <span>{w.title}</span>
              <div className="flex gap-2">
                <button className="btn" onClick={() => update(w)}>Edit</button>
                <button className="btn-danger" onClick={() => remove(w.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


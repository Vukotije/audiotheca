import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Artist } from '@/types'

export function ArtistsPage() {
  const [items, setItems] = useState<Artist[]>([])
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [media, setMedia] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try { const { data } = await api.get('/artists'); setItems(data); setError(null) } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!name.trim()) return
    await api.post('/artists', { name, biography: bio, multimedia: media })
    setName(''); setBio(''); setMedia('')
    load()
  }

  async function update(a: Artist) {
    const newName = prompt('New name', a.name)
    if (!newName) return
    const newBio = prompt('New bio', a.biography || '') || ''
    const newMedia = prompt('New multimedia URL', a.multimedia || '') || ''
    await api.put(`/artists/${a.id}`, { name: newName, biography: newBio, multimedia: newMedia })
    load()
  }

  async function remove(id: number) {
    if (!confirm('Delete artist?')) return
    await api.delete(`/artists/${id}`)
    load()
  }

  return (
    <div className="container max-w-4xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Artists</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
          <input className="input" placeholder="Multimedia URL" value={media} onChange={(e) => setMedia(e.target.value)} />
          <button className="btn-primary" onClick={create}>Add</button>
        </div>
        <ul className="divide-y divide-slate-700">
          {items.map(a => (
            <li key={a.id} className="py-2 flex items-center gap-2">
              <span className="min-w-48">{a.name}</span>
              <span className="text-slate-300 flex-1">{a.biography}</span>
              <button className="btn" onClick={() => update(a)}>Edit</button>
              <button className="btn-danger" onClick={() => remove(a.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


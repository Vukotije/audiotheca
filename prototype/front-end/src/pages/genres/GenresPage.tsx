import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Genre } from '@/types'

export function GenresPage() {
  const [items, setItems] = useState<Genre[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try { const { data } = await api.get('/genres'); setItems(data); setError(null) } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!name.trim()) return
    await api.post('/genres', { name, description })
    setName('')
    setDescription('')
    load()
  }

  async function update(g: Genre) {
    const newName = prompt('New name', g.name)
    if (!newName) return
    await api.put(`/genres/${g.id}`, { name: newName })
    load()
  }

  async function remove(id: number) {
    if (!confirm('Delete genre?')) return
    await api.delete(`/genres/${id}`)
    load()
  }

  return (
    <div className="container max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Genres</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <input className="input" placeholder="New genre" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input md:col-span-1" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn-primary" onClick={create}>Add</button>
        </div>
        <ul className="divide-y divide-slate-700">
          {items.map(g => (
            <li key={g.id} className="py-2 flex items-center gap-2">
              <span className="min-w-48">{g.name}</span>
              <button className="btn" onClick={() => update(g)}>Edit</button>
              <button className="btn-danger" onClick={() => remove(g.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


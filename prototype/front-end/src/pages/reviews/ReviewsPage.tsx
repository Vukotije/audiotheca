import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Review } from '@/types'

export function ReviewsPage() {
  const [items, setItems] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function load() {
    try { const { data } = await api.get('/reviews'); setItems(data); setError(null) } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function update(r: Review) {
    const ratingStr = prompt('New rating (1-5)', String(r.rating))
    if (!ratingStr) return
    const rating = Number(ratingStr)
    const comment = prompt('Comment', r.comment || '') || ''
    try { await api.put(`/reviews/${r.id}`, { rating, comment }); setSuccess('Review updated'); load() } catch (e: any) { setError(e.message) }
  }

  async function remove(id: number) {
    if (!confirm('Delete review?')) return
    try { await api.delete(`/reviews/${id}`); setSuccess('Review deleted'); load() } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="container max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">My Reviews</h2>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        {success && <div className="text-emerald-400 text-sm mb-2">{success}</div>}
        <ul className="divide-y divide-slate-700">
          {items.map(r => (
            <li key={r.id} className="py-2 flex items-center justify-between">
              <span>Work #{r.musical_work_id}</span>
              <span>Rating: {r.rating} {r.comment && `— ${r.comment}`} {!r.is_approved && <em className="text-amber-300">(Pending approval)</em>}</span>
              <div className="flex gap-2">
                <button className="btn" onClick={() => update(r)}>Edit</button>
                <button className="btn-danger" onClick={() => remove(r.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


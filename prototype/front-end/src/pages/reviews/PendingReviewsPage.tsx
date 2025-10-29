import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Review } from '@/types'
import { Alert } from '@/components/ui/Alert'

export function PendingReviewsPage() {
  const [items, setItems] = useState<Review[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function load() {
    try { const { data } = await api.get('/reviews/pending'); setItems(data); setError(null) } catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function approve(id: number) {
    try { await api.post(`/reviews/${id}/approve`); setSuccess('Review approved'); load() } catch (e: any) { setError(e.message) }
  }
  async function reject(id: number) {
    if (!confirm('Reject and delete this review?')) return
    try { await api.post(`/reviews/${id}/reject`); setSuccess('Review rejected'); load() } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="container max-w-4xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Pending Reviews</h2>
        {error && <div className="mb-2"><Alert type="error">{error}</Alert></div>}
        {success && <div className="mb-2"><Alert type="success">{success}</Alert></div>}
        <ul className="divide-y divide-slate-700">
          {items.map(r => (
            <li key={r.id} className="py-3 grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
              <span className="md:col-span-2">User: {r.user?.username} · Work #{r.musical_work_id}</span>
              <span className="md:col-span-2">Rating: {r.rating} {r.comment && `— ${r.comment}`}</span>
              <div className="md:col-span-2 flex gap-2 justify-start md:justify-end">
                <button className="btn-primary" onClick={() => approve(r.id)}>Approve</button>
                <button className="btn-danger" onClick={() => reject(r.id)}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}



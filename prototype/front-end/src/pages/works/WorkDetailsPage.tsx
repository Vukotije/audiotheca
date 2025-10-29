import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/api/client'
import type { MusicalWork } from '@/types'
import { useAuthStore } from '@/store/auth'
import { Alert } from '@/components/ui/Alert'

interface WorkWithReviews extends MusicalWork { reviews?: Array<{ id: number; rating: number; comment?: string }> }

export function WorkDetailsPage() {
  const { id } = useParams()
  const [work, setWork] = useState<WorkWithReviews | null>(null)
  const [myRating, setMyRating] = useState<number>(0)
  const [myComment, setMyComment] = useState('')
  const { token } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get(`/musical-works/${id}`); setWork(data); setError(null) }
      catch (e: any) { setError(e.message) }
    })()
  }, [id])

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    try {
      await api.post('/reviews', { musical_work_id: Number(id), rating: myRating, comment: myComment })
      const { data } = await api.get(`/musical-works/${id}`)
      setWork(data)
      setMyRating(0); setMyComment('')
      setSuccess('Review submitted')
      setError(null)
    } catch (e: any) { setError(e.message) }
  }

  if (!work) return <div className="container"><div className="card">Loading…</div></div>

  return (
    <div className="container max-w-3xl">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">{work.title}</h2>
        {work.description && <p className="text-slate-300 mb-4 max-w-2xl">{work.description}</p>}
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
        {success && <div className="text-emerald-400 text-sm mb-2">{success}</div>}
        <h3 className="text-slate-300 mb-2">Reviews</h3>
        <ul className="divide-y divide-slate-700">
          {(work.reviews || []).map(r => (
            <li key={r.id} className="py-2 flex items-center justify-between">
              <span>
                Rating {r.rating}/5 {r.comment && `— ${r.comment}`} {!r.is_approved && <em className="text-amber-300">(Pending)</em>}
              </span>
              {(token && (useAuthStore.getState().user?.role === 'editor' || useAuthStore.getState().user?.role === 'admin') && !r.is_approved) && (
                <span className="flex gap-2">
                  <button className="btn-primary" onClick={async () => { try { await api.post(`/reviews/${r.id}/approve`); const { data } = await api.get(`/musical-works/${id}`); setWork(data) } catch (e: any) { setError(e.message) } }}>Approve</button>
                  <button className="btn-danger" onClick={async () => { if (!confirm('Reject and delete this review?')) return; try { await api.post(`/reviews/${r.id}/reject`); const { data } = await api.get(`/musical-works/${id}`); setWork(data) } catch (e: any) { setError(e.message) } }}>Reject</button>
                </span>
              )}
            </li>
          ))}
        </ul>
        {token && (
          <form onSubmit={submitReview} className="mt-4 flex gap-2 items-center">
            <input className="input max-w-24" type="number" min={1} max={5} value={myRating} onChange={(e) => setMyRating(Number(e.target.value))} />
            <input className="input" placeholder="Comment" value={myComment} onChange={(e) => setMyComment(e.target.value)} />
            <button className="btn-primary" type="submit">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  )
}


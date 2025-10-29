import { useEffect, useMemo, useState } from 'react'
import { api } from '@/api/client'
import { Alert } from '@/components/ui/Alert'

interface AdminUser {
  id: number
  username: string
  email: string
  role: 'user' | 'producer' | 'admin'
  is_active: boolean
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [q, setQ] = useState('')

  async function load() {
    try { const { data } = await api.get('/users'); setUsers(data); setError(null) }
    catch (e: any) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  async function ban(id: number) {
    try { await api.post(`/users/${id}/ban`); setSuccess('User banned'); load() }
    catch (e: any) { setError(e.message) }
  }
  async function unban(id: number) {
    try { await api.post(`/users/${id}/unban`); setSuccess('User unbanned'); load() }
    catch (e: any) { setError(e.message) }
  }

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return users
    return users.filter(u => u.username.toLowerCase().includes(t) || u.email.toLowerCase().includes(t))
  }, [q, users])

  return (
    <div className="container max-w-5xl">
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Users</h2>
          <input className="input max-w-xs" placeholder="Search username or email" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {error && <div className="mb-2"><Alert type="error">{error}</Alert></div>}
        {success && <div className="mb-2"><Alert type="success">{success}</Alert></div>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-300">
              <tr className="border-b border-slate-700">
                <th className="py-2">ID</th>
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-800">
                  <td className="py-2">{u.id}</td>
                  <td className="py-2">{u.username}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.role === 'producer' ? 'editor' : u.role}</td>
                  <td className="py-2">{u.is_active ? <span className="text-emerald-400">Active</span> : <span className="text-red-400">Banned</span>}</td>
                  <td className="py-2 text-right">
                    {u.is_active ? (
                      <button className="btn-danger" onClick={() => ban(u.id)}>Ban</button>
                    ) : (
                      <button className="btn-primary" onClick={() => unban(u.id)}>Unban</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}



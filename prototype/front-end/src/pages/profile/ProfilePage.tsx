import { useAuthStore } from '@/store/auth'
import { FormEvent, useState } from 'react'

export function ProfilePage() {
  const { user, changePassword } = useAuthStore()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try { await changePassword(oldPassword, newPassword); setMessage('Password changed'); setError(null); setOldPassword(''); setNewPassword('') }
    catch (e: any) { setError(e.message) }
  }

  return (
    <div className="container max-w-md">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <div className="text-slate-300 mb-3">Logged in as: <b>{user?.username}</b> · {user?.email} ({user?.role})</div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Old password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <input className="input" placeholder="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {message && <div className="text-emerald-400 text-sm">{message}</div>}
          <button className="btn-primary w-full" type="submit">Change password</button>
        </form>
      </div>
    </div>
  )
}


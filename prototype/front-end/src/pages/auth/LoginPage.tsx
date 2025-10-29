import { FormEvent, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useLocation, useNavigate } from 'react-router-dom'

export function LoginPage() {
  const { login, loading, error } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!username || !password) { setLocalError('Username and password are required'); return }
    await login(username, password)
    if ((useAuthStore.getState().error)) return
    navigate(from, { replace: true })
  }

  return (
    <div className="container max-w-md">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {(localError || error) && <div className="text-red-400 text-sm">{localError || error}</div>}
          <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Logging in…' : 'Login'}</button>
        </form>
      </div>
    </div>
  )
}


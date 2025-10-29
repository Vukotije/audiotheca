import { FormEvent, useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { useNavigate } from 'react-router-dom'

export function RegisterPage() {
  const { register, loading, error } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user'|'producer'|'admin'>('user')
  const [localError, setLocalError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setLocalError(null)
    if (!username || !email || !password) { setLocalError('All fields are required'); return }
    await register(username, email, password, role)
    navigate('/')
  }

  return (
    <div className="container max-w-md">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Create an account</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <select className="input" value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value="user">User</option>
            <option value="producer">Editor</option>
            <option value="admin">Admin</option>
          </select>
          {(localError || error) && <div className="text-red-400 text-sm">{localError || error}</div>}
          <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? 'Registering…' : 'Register'}</button>
        </form>
      </div>
    </div>
  )
}


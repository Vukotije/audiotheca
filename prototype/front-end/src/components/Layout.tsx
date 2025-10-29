import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <div>
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/80 border-b border-slate-800">
        <div className="container flex items-center gap-4 py-3">
          <Link to="/" className="font-extrabold text-xl">Audiotheca</Link>
          <nav className="flex gap-2 text-slate-300">
            <NavLink to="/works" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Works</NavLink>
            <NavLink to="/search" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Search</NavLink>
            {user?.role === 'editor' && (
              <>
                <NavLink to="/manage/genres" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Genres</NavLink>
                <NavLink to="/manage/artists" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Artists</NavLink>
                <NavLink to="/manage/works" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Works Admin</NavLink>
                <NavLink to="/reviews/pending" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Pending</NavLink>
              </>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin/users" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>Users</NavLink>
            )}
            {user && <NavLink to="/reviews" className={({isActive})=>`px-2 py-1 rounded-lg ${isActive?'bg-slate-800 text-white':'hover:text-white'}`}>My Reviews</NavLink>}
          </nav>
          <div className="ml-auto flex gap-2">
            {!user && (
              <>
                <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
                <button className="btn" onClick={() => navigate('/register')}>Register</button>
              </>
            )}
            {user && (
              <>
                <NavLink className="btn" to="/profile">{user.username}</NavLink>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  )
}


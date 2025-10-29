import { create } from 'zustand'
import { api, setAuthToken } from '@/api/client'
import type { User, Role } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role?: 'user'|'producer'|'admin') => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const TOKEN_KEY = 'audiotheca.jwt'

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  loading: false,
  error: null,
  async login(username, password) {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/login', { username, password })
      const token: string = data?.access_token
      localStorage.setItem(TOKEN_KEY, token)
      setAuthToken(token)
      set({ token })
      await get().fetchMe()
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ loading: false })
    }
  },
  async register(username, email, password, role) {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/register', { username, email, password, role })
      const token: string = data?.access_token
      localStorage.setItem(TOKEN_KEY, token)
      setAuthToken(token)
      set({ token })
      await get().fetchMe()
    } catch (e: any) {
      set({ error: e.message })
    } finally {
      set({ loading: false })
    }
  },
  async logout() {
    try { await api.post('/logout') } catch {}
    localStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
    set({ token: null, user: null })
  },
  async fetchMe() {
    const token = get().token || localStorage.getItem(TOKEN_KEY)
    if (!token) return
    setAuthToken(token)
    try {
      const { data } = await api.get('/me')
      const roleFromApi: string = (data as any).role
      const normalizedRole: Role = (roleFromApi === 'producer' ? 'editor' : roleFromApi) as Role
      const normalizedUser: User = { ...(data as any), role: normalizedRole }
      set({ user: normalizedUser })
    } catch (e) {
      // invalid token
      localStorage.removeItem(TOKEN_KEY)
      setAuthToken(null)
      set({ token: null, user: null })
    }
  },
  async changePassword(oldPassword, newPassword) {
    await api.post('/change-password', { old_password: oldPassword, new_password: newPassword })
  }
}))

// Initialize auth header from stored token on import
setAuthToken(localStorage.getItem(TOKEN_KEY))


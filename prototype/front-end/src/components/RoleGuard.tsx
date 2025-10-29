import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { ReactNode } from 'react'

export function RoleGuard({ allowed, children }: { allowed: Array<'guest' | 'user' | 'producer' | 'admin'>; children: ReactNode }) {
  const { user } = useAuthStore()
  const role = user?.role ?? 'guest'
  if (!allowed.includes(role)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}


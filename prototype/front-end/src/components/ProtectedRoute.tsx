import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuthStore()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}


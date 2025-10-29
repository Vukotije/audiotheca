import { ReactNode } from 'react'

export function Alert({ type = 'info', children }: { type?: 'info' | 'error' | 'success' | 'warning'; children: ReactNode }) {
  const styles: Record<string, string> = {
    info: 'bg-slate-800 text-slate-200 border-slate-700',
    error: 'bg-red-950/50 text-red-200 border-red-700',
    success: 'bg-emerald-950/50 text-emerald-200 border-emerald-700',
    warning: 'bg-amber-950/50 text-amber-200 border-amber-700'
  }
  return (
    <div className={`border rounded-lg px-3 py-2 ${styles[type]}`}>{children}</div>
  )
}



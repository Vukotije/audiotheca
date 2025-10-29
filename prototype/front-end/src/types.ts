export type Role = 'guest' | 'user' | 'editor' | 'admin'

export interface User {
  id: number
  username: string
  email: string
  role: Role
}

export interface Genre { id: number; name: string; description?: string }
export interface Artist { id: number; name: string; biography?: string; multimedia?: string }
export interface MusicalWork { id: number; title: string; artist_id: number; genre_id: number; description?: string; artist?: { id: number; name: string }; genre?: { id: number; name: string } }
export interface Review { id: number; musical_work_id: number; rating: number; comment?: string; is_approved?: boolean; user?: { id: number; username: string; email: string } }

export interface Paginated<T> {
  items: T[]
  total: number
}


import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: apiBase,
  headers: { 'Content-Type': 'application/json' }
})

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Normalize error message
    const message = error?.response?.data?.message || error.message || 'Request error'
    return Promise.reject(new Error(message))
  }
)


import { useState } from 'react'

export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export function useSession() {
  const getSession = () => {
    try {
      const item = localStorage.getItem('session')
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  const [session, setSessionState] = useState(getSession())

  const setSessionToken = (token) => {
    localStorage.setItem('session', JSON.stringify(token))
    setSessionState(token)
  }

  const clearSession = () => {
    localStorage.removeItem('session')
    setSessionState(null)
  }

  return { session, setSessionToken, clearSession }
}

import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function useSession() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('pma_session')
    if (stored) {
      setSession(stored)
    }
  }, [])

  const setSessionToken = (token) => {
    localStorage.setItem('pma_session', token)
    setSession(token)
  }

  const clearSession = () => {
    localStorage.removeItem('pma_session')
    setSession(null)
  }

  return { session, setSessionToken, clearSession }
}

export { API_BASE, useSession }

import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

// getMe 응답({ profile, hostedPosts, appliedPosts })이든
// login 응답(user 객체)이든 동일한 identity 형태로 정규화
function normalizeUser(data) {
  if (!data) return null
  // getMe 형태면 profile을 펼치고, 아니면 그대로 사용
  const base = data.profile ? { ...data.profile } : { ...data }
  return base
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    api.getMe()
      .then((me) => setUser(normalizeUser(me)))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  function login(token, userData) {
    localStorage.setItem('token', token)
    setUser(normalizeUser(userData))
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// Shared sign-in state for the whole app: token + user (with role).
import { createContext, useContext, useState } from 'react'
import { request } from './api'

const AuthContext = createContext(null)
const KEY = 'portfolio-auth'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { token: null, user: null }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(load)

  async function signin(email, password) {
    const data = await request('/auth/signin', { method: 'POST', body: { email, password } })
    const next = { token: data.token, user: data.user }
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
    setAuth(next)
    return data.user
  }

  async function signup(name, email, password) {
    return request('/api/users', { method: 'POST', body: { name, email, password } })
  }

  async function signout() {
    try { await request('/auth/signout') } catch { /* still sign out locally */ }
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
    setAuth({ token: null, user: null })
  }

  const value = {
    token: auth.token,
    user: auth.user,
    isAdmin: auth.user?.role === 'admin',
    signin,
    signup,
    signout,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

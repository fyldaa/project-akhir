import { createContext, useContext, useState } from 'react'

const BASE = 'http://localhost:3001/api'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('charmevely_user')) } catch { return null }
  })

  const login = async (email, password) => {
    try {
      const res  = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      
      if (!res.ok) return { success: false, message: data.error || 'Email atau password salah.' }
      
      localStorage.setItem('charmevely_token', data.token)
      localStorage.setItem('charmevely_user', JSON.stringify(data.user))
      setUser(data.user)

      // PASTIIN DISINI: Mengirim isAdmin ke SignIn.jsx
      // !!data.user.is_admin akan mengubah nilai 1 jadi true, 0 jadi false
      return { success: true, isAdmin: !!data.user.is_admin }
      
    } catch (err) {
      return { success: false, message: 'Tidak bisa terhubung ke server. Pastikan backend sudah jalan.' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res  = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, message: data.error || 'Registrasi gagal.' }
      localStorage.setItem('charmevely_token', data.token)
      localStorage.setItem('charmevely_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true }
    } catch {
      return { success: false, message: 'Tidak bisa terhubung ke server.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('charmevely_user')
    localStorage.removeItem('charmevely_token')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoggedIn: !!user, 
      isAdmin: !!user?.is_admin 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
};
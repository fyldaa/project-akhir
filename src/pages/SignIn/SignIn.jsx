import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './SignIn.module.css'

export default function SignIn() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(form.email, form.password)
    
    setLoading(false)

    if (result.success) {
      // result.isAdmin ini didapat dari return di AuthContext tadi
      if (result.isAdmin) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } else {
      setError(result.message)
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={styles.iconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className={styles.title}>Login</h1>
            <p className={styles.subtitle}>Masuk ke akun Charmevely kamu</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email" name="email"
                placeholder="contoh@email.com"
                value={form.email} onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input
                type="password" name="password"
                placeholder="Password kamu"
                value={form.password} onChange={handleChange}
                required
              />
            </div>

            {error && <div className={styles.errorBox}>⚠️ {error}</div>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <p className={styles.registerLink}>
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
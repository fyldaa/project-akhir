import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './Register.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Password dan konfirmasi password tidak sama.')
      return
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)
    const result = await register(form.name, form.email, form.password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message || 'Registrasi gagal, coba lagi.')
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
            <h1 className={styles.title}>Daftar Akun</h1>
            <p className={styles.subtitle}>Buat akun untuk menyimpan favorit & menulis ulasan</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Nama Lengkap</label>
              <input
                id="name" type="text" name="name"
                placeholder="Nama kamu"
                value={form.name} onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email" type="email" name="email"
                placeholder="contoh@email.com"
                value={form.email} onChange={handleChange}
                required autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" name="password"
                placeholder="Minimal 6 karakter"
                value={form.password} onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirm">Konfirmasi Password</label>
              <input
                id="confirm" type="password" name="confirm"
                placeholder="Ulangi password"
                value={form.confirm} onChange={handleChange}
                required
              />
            </div>

            {error && <div className={styles.errorBox}>⚠️ {error}</div>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className={styles.loginLink}>
            Sudah punya akun? <Link to="/signin">Login di sini</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.css'

// Icon user SVG
function UserIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout, isLoggedIn, isAdmin } = useAuth()
  const dropRef = useRef(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const isActive = (path) => location.pathname === path

  const handleCategory = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.getElementById('category')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/category')
    }
  }

  const handleAccountClick = () => {
    if (!isLoggedIn) { navigate('/signin'); return }
    setMenuOpen(p => !p)
  }

  const goToDashboard = () => {
    setMenuOpen(false)
    navigate(isAdmin ? '/admin' : '/dashboard')
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.logo}>Charmevely</Link>

      <ul className={styles.links}>
        <li><Link to="/"        className={isActive('/')        ? styles.active : ''}>Home</Link></li>
        <li><a href="#category" onClick={handleCategory}        className={isActive('/category') ? styles.active : ''}>Category</a></li>
        <li><Link to="/contact" className={isActive('/contact') ? styles.active : ''}>Contact</Link></li>
      </ul>

      <div className={styles.icons}>
        <Link to="/category" title="Cari produk" className={styles.iconBtn}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </Link>

        {/* account */}
        <div className={styles.accountWrap} ref={dropRef}>
          <button
            className={styles.iconBtn}
            title={isLoggedIn ? user.name : 'Login'}
            onClick={handleAccountClick}
          >
            <UserIcon />
            {isLoggedIn && <span className={styles.dot} />}
          </button>

          {menuOpen && isLoggedIn && (
            <div className={styles.dropdown}>
              {/* user info */}
              <div className={styles.dropUser}>
                <div className={styles.dropAvatarCircle}>
                  <UserIcon size={18} />
                </div>
                <div>
                  <div className={styles.dropName}>{user.name}</div>
                  <div className={styles.dropEmail}>{user.email}</div>
                </div>
              </div>
              <div className={styles.dropDivider} />
              <button className={styles.dropItem} onClick={goToDashboard}>
                {isAdmin ? '⚙️  Admin Panel' : '👤  Dashboard'}
              </button>
              <button className={styles.dropItem} onClick={handleLogout}>
                🚪  Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
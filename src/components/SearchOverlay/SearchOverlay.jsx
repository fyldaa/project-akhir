import { useEffect, useRef } from 'react'
import styles from './SearchOverlay.module.css'

export default function SearchOverlay({ isOpen, onClose }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.box}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4748C" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input ref={inputRef} type="text" placeholder="Cari aksesoris…" className={styles.input} />
        <button className={styles.close} onClick={onClose}>✕</button>
      </div>
    </div>
  )
}

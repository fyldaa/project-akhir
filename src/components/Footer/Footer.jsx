import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>

        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>Charmevely</Link>
        </div>

        <div className={styles.about}> 
          <p>Charmevely curates accessories to complete your everyday style, adding a soft touch of charm to every look.</p>
          <p className={styles.tagline}>Find your favorites<br />and discover them<br />through our selected shops.</p>
        </div>

        <div className={styles.contact}>
          <p className={styles.contactTitle}>Contact</p>
          <p>Email: charmevely@accessories.id</p>
          <p>Phone: +123 456 789</p>

          <div className={styles.socials}>
            <a href="https://www.facebook.com/charmevely" target="_blank" rel="noopener noreferrer" className={styles.si} title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>

            <a href="https://www.instagram.com/charmevely" target="_blank" rel="noopener noreferrer" className={styles.si} title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>
   
            <a href="https://www.tiktok.com/@charmevely" target="_blank" rel="noopener noreferrer" className={styles.si} title="TikTok">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.16 8.16 0 0 0 4.78 1.52V6.93a4.85 4.85 0 0 1-1.01-.24z"/>
              </svg>
            </a>

            <a href="https://www.x.com/charmevely" target="_blank" rel="noopener noreferrer" className={styles.si} title="X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className={styles.bottom}>
        <p>© 2026 Charmevely. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
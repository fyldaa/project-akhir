import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  // GANTI FUNGSI INI
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    const savedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
    const newMessage = { 
      ...form, 
      id: Date.now(), 
      date: new Date().toLocaleString('id-ID') 
    }
    const updatedMessages = [newMessage, ...savedMessages]

    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages))
    setSubmitted(true)
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        <div className={styles.header}>
          <h1>Contact</h1>
          <p>Ada pertanyaan? Kami siap membantu!</p>
        </div>

        <div className={styles.content}>

          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📧</span>
              <div>
                <div className={styles.infoLabel}>Email</div>
                <a href="mailto:charmevely@accessories.id" className={styles.infoVal}>charmevely@accessories.id</a>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📞</span>
              <div>
                <div className={styles.infoLabel}>Phone / WhatsApp</div>
                <a href="https://wa.me/62123456789" target="_blank" rel="noopener noreferrer" className={styles.infoVal}>+62 123 456 789</a>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🛍️</span>
              <div>
                <div className={styles.infoLabel}>Shopee</div>
                <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer" className={styles.infoVal}>shopee.co.id/charmevely</a>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📸</span>
              <div>
                <div className={styles.infoLabel}>Instagram</div>
                <a href="https://www.instagram.com/akbauruu16" target="_blank" rel="noopener noreferrer" className={styles.infoVal}>@charmevely</a>
              </div>
            </div>
          </div>

          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.success}>
                <span>💌</span>
                <h2>Pesan Terkirim!</h2>
                <p>Terima kasih sudah menghubungi kami. Kami akan segera membalas pesanmu.</p>
                <button className={styles.resetBtn} onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }) }}>
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.formTitle}>Kirim Pesan</h2>

                <div className={styles.field}>
                  <label>Nama</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama kamu"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@kamu.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label>Pesan</label>
                  <textarea
                    name="message"
                    placeholder="Tuliskan pesanmu di sini..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Kirim Pesan →
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

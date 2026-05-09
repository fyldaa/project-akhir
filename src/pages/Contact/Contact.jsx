import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Handle input perubahan form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Simpan pesan ke LocalStorage
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    // Validasi sederhana
    if (!name || !email || !message) return;

    const savedMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    
    const newMessage = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleString('id-ID'),
    };

    const updatedMessages = [newMessage, ...savedMessages];
    localStorage.setItem('contact_messages', JSON.stringify(updatedMessages));

    // Feedback ke user
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' }); // Reset form setelah kirim

    // Sembunyikan notifikasi sukses setelah 5 detik
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Contact</h1>
          <p>Ada pertanyaan? Kami siap membantu!</p>
        </header>

        <section className={styles.content}>
          <div className={styles.infoCol}>
            <ContactInfo 
              icon="📧" 
              label="Email" 
              value="fyldaa164@gmail.com" 
              link="mailto:fyldaa164@gmail.com" 
            />
            <ContactInfo 
              icon="📞" 
              label="Phone / WhatsApp" 
              value="+62 123 456 789" 
              link="https://wa.me/62123456789" 
            />
            <ContactInfo 
              icon="🛍️" 
              label="Shopee" 
              value="shopee.co.id/charmevely" 
              link="https://shopee.co.id" 
            />
            <ContactInfo 
              icon="📸" 
              label="Instagram" 
              value="@nzzfyaa" 
              link="https://www.instagram.com/nzzfyaa" 
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactInfo({ icon, label, value, link }) {
  return (
    <div className={styles.infoCard}>
      <span className={styles.infoIcon}>{icon}</span>
      <div>
        <div className={styles.infoLabel}>{label}</div>
        <a href={link} target="_blank" rel="noopener noreferrer" className={styles.infoVal}>
          {value}
        </a>
      </div>
    </div>
  );
}
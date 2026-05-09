import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import styles from './Contact.module.css';

export default function Contact() {
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
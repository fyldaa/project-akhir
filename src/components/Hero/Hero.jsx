import styles from './Hero.module.css'
import pictImg from "../../assets/pict.png";

export default function Hero() {
  return (
    <section className={styles.hero}>

      <div className={styles.content}>
        <h1>Welcome to <em>Charmevely</em></h1>
        <p>Where the smallest details can change everything. Explore curated accessories that elevate your look and brighten your mood. From playful to elegant, each piece adds a touch of charm to your everyday style.</p>
      </div>

      <div className={styles.imageWrap}>
        <img src={pictImg} alt="bracelet" />
      </div>
    </section>
  )
}

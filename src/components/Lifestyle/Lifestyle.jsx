import styles from './Lifestyle.module.css'
import lfs1 from '../../assets/lfs1.jpeg'
import lfs2 from '../../assets/lfs2.jpeg'

export default function Lifestyle() {
  return (
    <section className={styles.section}>
      <div className={styles.photos}>
        <img src={lfs1} />
        <img src={lfs2} />
      </div>
      <div className={styles.overlay}>
        <h2>Choose Accessories for Your Daily Style</h2>
      </div>
    </section>
  )
}

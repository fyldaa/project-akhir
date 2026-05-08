import styles from './Category.module.css'
import imgBracelet from '../../assets/bracelet.png'
import imgNecklace from '../../assets/necklace.png'
import imgRing from '../../assets/ring.png'

const categories = [
  { img: imgBracelet, name: 'Bracelet' },
  { img: imgNecklace, name: 'Necklace' },
  { img: imgRing, name: 'Ring' },
]

export default function Category() {
  return (
    <section className={styles.section} id="category">
      <h2 className={styles.title}>Category</h2>

      <div className={styles.grid}>
        {categories.map((cat, i) => (
          <a
            key={cat.name}
            href="#"
            className={styles.card}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={styles.imgWrap}>
              <img src={cat.img} alt={cat.name} />
            </div>
            <span className={styles.label}>{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
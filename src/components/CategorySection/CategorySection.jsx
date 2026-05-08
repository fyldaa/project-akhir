import { Link } from 'react-router-dom'
import styles from './CategorySection.module.css'

import imgBracelet from '../../assets/bracelet.png'
import imgNecklace from '../../assets/necklace.png'
import imgRing from '../../assets/ring.png'

const cats = [
  { name: 'Bracelet', img: imgBracelet },
  { name: 'Necklace', img: imgNecklace },
  { name: 'Ring', img: imgRing },
]

export default function CategorySection() {
  return (
    <section className={styles.section} id="category">
      <h2 className={styles.title}>Category</h2>

      <div className={styles.grid}>
        {cats.map((c, i) => (
          <Link
            key={c.name}
            to={`/category?tab=${c.name}`}
            className={styles.card}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={styles.imgWrap}>
              <img src={c.img} alt={c.name} />
            </div>

            <span className={styles.label}>{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './BestSeller.module.css';

function resolveImageUrl(url) {
  if (!url) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('http'))  return url
  if (url.startsWith('/'))     return url
  if (url.startsWith('uploads/')) return `/${url}`
  return `/${url}`
}


const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

export default function BestSeller() {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil semua data produk dari API backend
    fetch('http://localhost:3001/api/products') 
      .then((res) => res.json())
      .then((data) => {
        // Hanya ambil yang nilainya 1 atau true
        const onlyBest = data.filter(p => 
          p.is_bestseller === 1 || 
          p.is_bestseller === "1" || 
          p.is_bestseller === true
        );
        
        setBestSellers(onlyBest);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal load data best seller:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className={styles.loading}>Menyiapkan koleksi terlaris...</div>;

  return (
    <section className={styles.section} id="bestseller">
      <div className={styles.container}>
        <h2 className={styles.title}>Best Seller</h2>
        
        {bestSellers.length > 0 ? (
          <div className={styles.grid}>
            {bestSellers.map((p, i) => (
              <div key={p.id} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.imgWrap}>
                  {/* CEK: Ganti p.image_url jika nama kolom fotomu di DB berbeda */}
                  {p.image_url ? (
                    <img 
                      src={resolveImageUrl(p.image_url)} 
                      alt={p.name} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image' }}
                    />
                  ) : (
                    <div className={styles.placeholder}>📦</div>
                  )}
                  <div className={styles.badge}>Best Seller</div>
                </div>

                <div className={styles.info}>
                  <h3 className={styles.name}>{p.name}</h3>
                  <p className={styles.price}>{formatPrice(p.price)}</p>
                  
                  <div className={styles.btnWrap}>
                    <Link to={`/product/${p.id}`} className={styles.btn}>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>Belum ada produk pilihan terbaik.</div>
        )}
      </div>
    </section>
  );
}
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './UserDashboard.module.css'

// Helper format harga
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price);
};

function UserIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function Stars({ value }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= value ? styles.starOn : styles.starOff}>★</span>
      ))}
    </div>
  )
}

export default function UserDashboard() {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn } = useAuth()
  
  const [tab, setTab] = useState('favs')
  const [myReviews, setMyReviews] = useState([])
  const [favProds, setFavProds] = useState([])
  const [loading, setLoading] = useState(true)

  // Ambil data Ulasan dan Favorit dari Database
  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 1. Ambil ulasan user
        const revRes = await fetch(`http://localhost:3001/api/reviews/user/${user.id}`);
        const reviews = await revRes.json();
        setMyReviews(Array.isArray(reviews) ? reviews : []);

        // 2. Ambil produk favorit user (Endpoint ini harus sudah ada di backend)
        const favRes = await fetch(`http://localhost:3001/api/favorites/${user.id}`);
        if (favRes.ok) {
          const favs = await favRes.json();
          setFavProds(Array.isArray(favs) ? favs : []);
        }

      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, user?.id]);

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className={styles.notLoggedIn}>
          <span>🔒</span>
          <p>Kamu harus login terlebih dahulu</p>
          <Link to="/signin" className={styles.loginBtn}>Login Sekarang</Link>
        </div>
        <Footer />
      </>
    )
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Hapus ulasan ini secara permanen?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        setMyReviews(myReviews.filter(r => r.id !== reviewId));
      }
    } catch (err) {
      alert("Gagal menghapus ulasan");
    }
  }

  // Fungsi helper untuk menentukan URL gambar agar tidak pecah
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return url; // Untuk file di folder public/apple.png
    return `http://localhost:3001/uploads/${url}`; // Untuk file di backend
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.banner}>
          <div className={styles.bannerInner}>
            <div className={styles.avatarCircle}><UserIcon size={28} /></div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>Halo, {user.name}! 👋</h1>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.userStats}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>{favProds.length}</span>
                  <span className={styles.statLabel}>Favorit</span>
                </div>
                <div className={styles.statDiv} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>{myReviews.length}</span>
                  <span className={styles.statLabel}>Ulasan</span>
                </div>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/') }}>🚪 Logout</button>
          </div>
        </div>

        <div className={styles.tabsBar}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'favs' ? styles.tabActive : ''}`} onClick={() => setTab('favs')}>
              ♥ Favorit Saya ({favProds.length})
            </button>
            <button className={`${styles.tab} ${tab === 'reviews' ? styles.tabActive : ''}`} onClick={() => setTab('reviews')}>
              ★ Ulasan Saya ({myReviews.length})
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {loading ? (
            <p style={{textAlign: 'center'}}>Memuat data...</p>
          ) : (
            <>
              {/* TAB FAVORIT */}
              {tab === 'favs' && (
                favProds.length === 0 ? (
                  <div className={styles.empty}>
                    <span>🤍</span>
                    <p>Belum ada produk favorit</p>
                    <Link to="/category" className={styles.browseBtn}>Jelajahi Produk</Link>
                  </div>
                ) : (
                  <div className={styles.grid}>
                    {favProds.map((p, i) => (
                      <div key={p.id} className={styles.card} style={{ animationDelay: `${i * 0.07}s` }}>
                        <div className={styles.cardImg}>
                          {/* FIX: Gunakan helper getImageUrl */}
                          {p.image_url ? (
                            <img src={getImageUrl(p.image_url)} alt={p.name} />
                          ) : '📦'}
                        </div>
                        <div className={styles.cardInfo}>
                          <span className={styles.cardBadge}>{p.category}</span>
                          <div className={styles.cardName}>{p.name}</div>
                          <div className={styles.cardPrice}>{formatPrice(p.price)}</div>
                          <Link to={`/product/${p.id}`} className={styles.cardBtn}>Details</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* TAB ULASAN */}
              {tab === 'reviews' && (
                myReviews.length === 0 ? (
                  <div className={styles.empty}>
                    <span>💬</span>
                    <p>Belum ada ulasan yang ditulis</p>
                    <Link to="/category" className={styles.browseBtn}>Lihat Produk</Link>
                  </div>
                ) : (
                  <div className={styles.reviewList}>
                    {myReviews.map(r => (
                      <div key={r.id} className={styles.reviewCard}>
                        <div className={styles.reviewProd}>
                          {/* Cari bagian ini di UserDashboard.jsx */}
                            <div className={styles.reviewThumb}>
                              {r.image_url ? ( // GANTI DARI r.product_image KE r.image_url
                                <img src={getImageUrl(r.image_url)} alt={r.product_name} />
                              ) : '📦'}
                            </div>
                          <div className={styles.reviewProdInfo}>
                            <div className={styles.reviewProdName}>{r.product_name || 'Produk'}</div>
                            <span className={styles.reviewProdBadge}>{r.product_category}</span>
                          </div>
                          <Stars value={r.rating} />
                          <button className={styles.deleteBtn} onClick={() => handleDeleteReview(r.id)}>✕</button>
                        </div>
                        <p className={styles.reviewComment}>{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
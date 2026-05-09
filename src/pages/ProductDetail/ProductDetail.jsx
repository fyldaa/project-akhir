import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar  from '../../components/Navbar/Navbar'
import Footer  from '../../components/Footer/Footer'
import { useAuth }   from '../../context/AuthContext'
import styles from './ProductDetail.module.css'

const BASE = 'http://localhost:3001/api'
const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID')

function resolveImageUrl(url) {
  if (!url) return null
  if (url.startsWith('data:')) return url           // base64
  if (url.startsWith('http'))  return url           // url penuh
  if (url.startsWith('/'))     return url           // path absolut
  if (url.startsWith('uploads/')) return `/${url}`  // disimpan di public/uploads/
  return `/${url}`                                  // file lama di public/
}

function Stars({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          className={`${styles.star} ${n <= (hover || value) ? styles.starOn : ''}`}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(n)}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
        >★</button>
      ))}
    </div>
  )
}

function UserIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

export default function ProductDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user, isLoggedIn } = useAuth()

  const [product,  setProduct]  = useState(null)
  const [reviews,  setReviews]  = useState([])
  const [favIds,   setFavIds]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  const [rating,   setRating]   = useState(5)
  const [comment,  setComment]  = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const token = localStorage.getItem('charmevely_token')

  // Ambil produk dari API
  useEffect(() => {
    setLoading(true)
    fetch(`${BASE}/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError('Produk tidak ditemukan'); return }
        setProduct(data)
      })
      .catch(() => setError('Gagal memuat produk. Pastikan backend sudah jalan.'))
      .finally(() => setLoading(false))
  }, [id])

  // Ambil reviews
  useEffect(() => {
    fetch(`${BASE}/reviews/${id}`)
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {})
  }, [id])

  // Ambil fav ids kalau sudah login
  useEffect(() => {
    if (!isLoggedIn || !token) return
    fetch(`${BASE}/favorites/ids`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setFavIds)
      .catch(() => {})
  }, [isLoggedIn])

  const isFav = favIds.includes(Number(id))

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  const handleFav = async () => {
    if (!isLoggedIn) { navigate('/signin'); return }
    const res  = await fetch(`${BASE}/favorites/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setFavIds(prev => data.favorited ? [...prev, Number(id)] : prev.filter(x => x !== Number(id)))
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${BASE}/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment }),
      })
      if (res.ok) {
        // Refresh reviews
        const updated = await fetch(`${BASE}/reviews/${id}`).then(r => r.json())
        setReviews(updated)
        setComment(''); setRating(5); setShowForm(false)
      }
    } catch {}
    setSubmitting(false)
  }

  const handleDeleteReview = async (reviewId) => {
    await fetch(`${BASE}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  // ── Loading state ──
  if (loading) return (
    <>
      <Navbar />
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Memuat produk...</p>
      </div>
      <Footer />
    </>
  )

  // ── Error state ──
  if (error || !product) return (
    <>
      <Navbar />
      <div className={styles.notFound}>
        <span>😢</span>
        <p>{error || 'Produk tidak ditemukan'}</p>
        <button className={styles.goBack} onClick={() => navigate(-1)}>← Kembali</button>
      </div>
      <Footer />
    </>
  )

  return (
    <>
      <Navbar />
      <main className={styles.main}>

        <div className={styles.topSection}>
          <div className={styles.header}>
            <h1>{product.category} Details</h1>
          </div>

          <div className={styles.card}>
            {/* Gambar produk */}
            <div className={styles.imgWrap}>
              {product.image_url
                ? <img src={resolveImageUrl(product.image_url)} alt={product.name} />
                : <div className={styles.ph}>📦</div>
              }
            </div>

            {/* Info produk */}
            <div className={styles.info}>
              <div className={styles.nameRow}>
                <h2 className={styles.name}>{product.name}</h2>
                <button
                  className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
                  onClick={handleFav}
                  title={isLoggedIn ? (isFav ? 'Hapus favorit' : 'Tambah favorit') : 'Login untuk favorit'}
                >
                  {isFav ? '♥' : '♡'}
                </button>
              </div>

              {reviews.length > 0 && (
                <div className={styles.ratingRow}>
                  <Stars value={Math.round(avgRating)} />
                  <span className={styles.ratingNum}>{avgRating}</span>
                  <span className={styles.ratingCount}>({reviews.length} ulasan)</span>
                </div>
              )}

              <p className={styles.price}>{formatPrice(product.price)}</p>
              <div className={styles.detailsLabel}>details ◇</div>
              <ul className={styles.detailsList}>
                {(product.details || []).map((d, i) => <li key={i}>• {d}</li>)}
              </ul>

              <div className={styles.btnRow}>
                <a href={product.shopee_url} target="_blank" rel="noopener noreferrer" className={styles.shopBtn}>
                  Shop
                </a>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <div className={styles.reviewSection}>
          <div className={styles.reviewInner}>
            <div className={styles.reviewHeader}>
              <h2 className={styles.reviewTitle}>Ulasan Pelanggan</h2>
              <button
                className={styles.addReviewBtn}
                onClick={() => { if (!isLoggedIn) { navigate('/signin'); return } setShowForm(p => !p) }}
              >
                {!isLoggedIn ? '🔒 Login untuk Ulasan' : showForm ? 'Batal' : '+ Tulis Ulasan'}
              </button>
            </div>

            {/* Form review */}
            {showForm && isLoggedIn && (
              <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                <div className={styles.reviewFormUser}>
                  <div className={styles.reviewIconWrap}><UserIcon size={16} /></div>
                  <span>{user.name}</span>
                </div>
                <div className={styles.ratingField}>
                  <label>Rating</label>
                  <Stars value={rating} onChange={setRating} />
                </div>
                <div className={styles.commentField}>
                  <label>Komentar</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Tulis pengalamanmu dengan produk ini..."
                    rows={3} required
                  />
                </div>
                <button type="submit" className={styles.submitReviewBtn} disabled={submitting}>
                  {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            )}

            {/* Daftar review */}
            {reviews.length === 0 ? (
              <div className={styles.noReview}><p>Belum ada ulasan. Jadilah yang pertama!</p></div>
            ) : (
              <div className={styles.reviewList}>
                {reviews.map(r => (
                  <div key={r.id} className={styles.reviewCard}>
                    <div className={styles.reviewTop}>
                      <div className={styles.reviewIconWrap}><UserIcon size={16} /></div>
                      <div className={styles.reviewMeta}>
                        <div className={styles.reviewName}>{r.user_name}</div>
                        <Stars value={r.rating} />
                      </div>
                      <span className={styles.reviewDate}>
                        {new Date(r.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}
                      </span>
                      {isLoggedIn && (user.id === r.user_id || user.is_admin) && (
                        <button className={styles.deleteReviewBtn} onClick={() => handleDeleteReview(r.id)}>✕</button>
                      )}
                    </div>
                    <p className={styles.reviewComment}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './Category.module.css'

function resolveImageUrl(url) {
  if (!url) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('http'))  return url
  if (url.startsWith('/'))     return url
  if (url.startsWith('uploads/')) return `/${url}`
  return `/${url}`
}


const BASE         = 'http://localhost:3001/api'
const CATEGORIES   = ['Bracelet', 'Necklace', 'Ring']
const formatPrice  = (p) => 'Rp ' + Number(p).toLocaleString('id-ID')

const SORT_OPTIONS = [
  { value: '',            label: 'Default' },
  { value: 'price_asc',   label: 'Harga: Rendah → Tinggi' },
  { value: 'price_desc',  label: 'Harga: Tinggi → Rendah' },
  { value: 'rating_desc', label: 'Rating: Tertinggi' },
  { value: 'rating_asc',  label: 'Rating: Terendah' },
]

function StarDisplay({ value }) {
  return (
    <div className={styles.starRow}>
      {[1,2,3,4,5].map(n => (
        <span key={n} className={n <= Math.round(value) ? styles.starOn : styles.starOff}>★</span>
      ))}
      <span className={styles.starNum}>{Number(value).toFixed(1)}</span>
    </div>
  )
}

export default function Category() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'Bracelet'

  // State filter
  const [search,    setSearch]    = useState('')
  const [activeSearch, setActiveSearch] = useState('') // Tambahan untuk Debounce
  const [sort,      setSort]      = useState('')
  const [minPrice,  setMinPrice]  = useState('')
  const [maxPrice,  setMaxPrice]  = useState('')
  const [showFilter, setShowFilter] = useState(false)

  // State data
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // 1. Logika Debounce: Nunggu user berhenti ngetik 0.6 detik baru search
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearch(search)
    }, 600)
    return () => clearTimeout(timer)
  }, [search])

  // 2. Fetch produk (Nama parameter disesuaikan dengan req.query Backend)
  const fetchProducts = useCallback(() => {
    setLoading(true)
    setError('')

    const params = new URLSearchParams()
    params.set('category', activeTab)
    
    // Sesuaikan dengan variabel di backend kamu (search, sortBy, minPrice, maxPrice)
    if (activeSearch) params.set('search', activeSearch)
    if (sort)         params.set('sortBy', sort)
    if (minPrice)     params.set('minPrice', minPrice)
    if (maxPrice)     params.set('maxPrice', maxPrice)

    fetch(`${BASE}/products?${params.toString()}`)
      .then(r => {
        if (!r.ok) throw new Error('Gagal mengambil data dari server.')
        return r.json()
      })
      .then(data => {
        if (Array.isArray(data)) setProducts(data)
        else setError('Format data salah.')
      })
      .catch(() => setError('Tidak bisa terhubung ke server. Pastikan Backend nyala!'))
      .finally(() => setLoading(false))
  }, [activeTab, activeSearch, sort, minPrice, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Reset filter saat ganti tab
  const handleTabChange = (cat) => {
    setSearch(''); setSort(''); setMinPrice(''); setMaxPrice(''); setActiveSearch('')
    setSearchParams({ tab: cat })
  }

  const handleResetFilter = () => {
    setSort(''); setMinPrice(''); setMaxPrice(''); setSearch(''); setActiveSearch('')
  }

  const hasFilter = sort || minPrice || maxPrice || search

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{activeTab} Collection</h1>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.tab} ${activeTab === cat ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
          </div>

          <button
            className={`${styles.filterToggle} ${showFilter ? styles.filterToggleActive : ''}`}
            onClick={() => setShowFilter(p => !p)}
          >
            Filter & Urutkan {hasFilter && <span className={styles.filterDot} />}
          </button>
        </div>
        {showFilter && (
          <div className={styles.filterPanel}>
            {/* Urutkan */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Urutkan</div>
              <div className={styles.sortOptions}>
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.sortChip} ${sort === opt.value ? styles.sortChipActive : ''}`}
                    onClick={() => setSort(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

    {/* Rentang Harga - Struktur HTML ini harus presisi buat CSS kamu */}
    <div className={styles.filterGroup}>
      <div className={styles.filterGroupTitle}>Rentang Harga</div>
      <div className={styles.priceRange}>
        <div className={styles.priceInput}>
          <span>Rp</span>
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice} 
            onChange={e => setMinPrice(e.target.value)} 
          />
        </div>
        <span className={styles.priceDash}>—</span>
        <div className={styles.priceInput}>
          <span>Rp</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice} 
            onChange={e => setMaxPrice(e.target.value)} 
          />
        </div>
      </div>

      {/* Price Presets */}
      <div className={styles.pricePresets}>
        {[
          { label: '< Rp 10.000',  min: '',    max: '10000' },
          { label: 'Rp 10–25rb',   min: '10000', max: '25000' },
          { label: 'Rp 25–50rb',   min: '25000', max: '50000' },
          { label: '> Rp 50.000',  min: '50000', max: '' },
        ].map(p => (
          <button
            key={p.label}
            className={`${styles.presetChip} ${minPrice === p.min && maxPrice === p.max ? styles.presetChipActive : ''}`}
            onClick={() => { setMinPrice(p.min); setMaxPrice(p.max) }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>

    {/* Reset Button */}
    {hasFilter && (
      <button className={styles.resetBtn} onClick={handleResetFilter}>
        ✕ Reset semua filter
      </button>
    )}
  </div>
)}
        {/* Grid Produk */}
        <div className={styles.gridWrap}>
          {loading ? (
            <div className={styles.loadingWrap}><div className={styles.spinner} /><p>Memuat...</p></div>
          ) : error ? (
            <div className={styles.errorWrap}><p>{error}</p></div>
          ) : products.length === 0 ? (
            <div className={styles.empty}><p>Produk tidak ditemukan</p></div>
          ) : (
            <div className={styles.grid}>
              {products.map((p, i) => (
                <div key={p.id} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={styles.imgWrap}>
                    {p.image_url ? <img src={resolveImageUrl(p.image_url)} alt={p.name} /> : <div className={styles.ph}>📦</div>}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.name}>{p.name}</div>
                    <div className={styles.price}>{formatPrice(p.price)}</div>
                    {Number(p.avg_rating) > 0 && <StarDisplay value={p.avg_rating} />}
                    <div className={styles.btnWrap}>
                      <Link to={`/product/${p.id}`} className={styles.btn}>Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
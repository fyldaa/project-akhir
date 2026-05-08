// Admin.jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Admin.module.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const CATEGORIES = ['Bracelet', 'Necklace', 'Ring']
const formatPrice = (p) => 'Rp ' + Number(p).toLocaleString('id-ID')

// Resolve semua jenis image_url: base64, http, path publik, filename
function resolveImageUrl(url) {
  if (!url) return null
  if (url.startsWith('data:')) return url          // base64
  if (url.startsWith('http')) return url           // url penuh
  if (url.startsWith('/')) return url              // path absolut
  if (url.startsWith('uploads/')) return `/${url}` // disimpan di public/uploads/
  return `/${url}`                                 // file di public/ (produk lama)
}

function getToken() {
  return localStorage.getItem('charmevely_token') || ''
}

function ImageUploader({ current, onFileChange }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    setPreview(current ? resolveImageUrl(current) : null)
  }, [current])

  const handleFile = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onFileChange(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div
      className={`${styles.uploaderBox} ${dragging ? styles.uploaderDrag : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <>
          <img src={preview} alt="preview" className={styles.uploaderPreview} />
          <div className={styles.uploaderOverlay}><span>Ganti Foto</span></div>
        </>
      ) : (
        <div className={styles.uploaderEmpty}>
          <div className={styles.uploaderIcon}>📷</div>
          <p className={styles.uploaderHint}>Klik atau drag foto ke sini</p>
          <p className={styles.uploaderSub}>JPG, PNG, WEBP — maks 5 MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({ byCategory: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const emptyForm = { name: '', price: '', category: 'Bracelet', shopee_url: '', details: '' }
  const [form, setForm] = useState(emptyForm)

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (activeTab !== 'All') params.set('category', activeTab)
      if (search) params.set('search', search)
      const res = await fetch(`${API}/products?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setProducts(await res.json())
    } catch (e) {
      setError('Gagal memuat produk: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [activeTab, search])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products/stats`)
      if (res.ok) setStats(await res.json())
    } catch (_) {}
  }, [])

  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [fetchProducts, fetchStats])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Compress gambar sebelum jadi base64 (resize maks 800px)
  const compressImage = (file) => new Promise((resolve, reject) => {
    const img = new Image()
    const objUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objUrl)
      const MAX = 800
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      let b64 = canvas.toDataURL('image/jpeg', 0.8)
      if (b64.length > 300000) b64 = canvas.toDataURL('image/jpeg', 0.6)
      resolve(b64)
    }
    img.onerror = reject
    img.src = objUrl
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleConfirmSave = async () => {
    setShowConfirm(false)
    setSaving(true)
    try {
      const url = editId ? `${API}/products/${editId}` : `${API}/products`
      const method = editId ? 'PUT' : 'POST'
      const token = getToken()

      const detailsArr = form.details.split('\n').map(d => d.trim()).filter(Boolean)

      // Tentukan image_url: file baru → compress ke base64 | tidak ada file → pakai url lama
      let image_url = currentImage || null
      if (imageFile) {
        try { image_url = await compressImage(imageFile) } catch (_) {}
      }

      const payload = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        shopee_url: form.shopee_url || 'https://shopee.co.id',
        details: detailsArr,
        image_url,
        is_bestseller: false,
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchProducts()
        await fetchStats()
        handleCancel()
      } else {
        let msg = `HTTP ${res.status}`
        try { const d = await res.json(); msg = d.error || msg } catch (_) {}
        setError('Gagal menyimpan: ' + msg)
      }
    } catch (e) {
      setError('Gagal menyimpan: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelConfirm = () => {
    setShowConfirm(false)
  }

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      shopee_url: p.shopee_url || p.shopeeUrl || '',
      details: (p.details || []).join('\n'),
    })
    setCurrentImage(p.image_url)
    setImageFile(null)
    setEditId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return
    try {
      const token = getToken()
      const res = await fetch(`${API}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await fetchProducts(); await fetchStats()
    } catch (e) {
      setError('Gagal menghapus: ' + e.message)
    }
  }

  const handleCancel = () => {
    setShowForm(false); setEditId(null)
    setForm(emptyForm); setImageFile(null); setCurrentImage(null)
    setError(null)
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>Charmevely</div>
        <nav className={styles.sidebarNav}>
          <button className={`${styles.navItem} ${styles.navActive}`}>📦 Products</button>
          <Link to="/" className={styles.navItem}>🏠 Home</Link>
          <Link to="/signin" onClick={() => { localStorage.removeItem('charmevely_token'); localStorage.removeItem('charmevely_user') }} className={styles.navItem}>🚪 Sign Out</Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Product Management</h1>
            <p className={styles.pageSubtitle}>{(stats.total || products.length)} total produk</p>
          </div>
          <button className={styles.addBtn}
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); setCurrentImage(null); setImageFile(null) }}>
            + Tambah Produk
          </button>
        </div>

        {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>{editId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label>Foto Produk</label>
                <ImageUploader
                  current={currentImage}
                  onFileChange={(file) => setImageFile(file)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Nama Produk</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label>Harga (Rp)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label>Kategori</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label>Shopee URL</label>
                <input name="shopee_url" value={form.shopee_url} onChange={handleChange} />
              </div>

              <div className={styles.field}>
                <label>Details (satu baris per item)</label>
                <textarea name="details" rows={4} value={form.details} onChange={handleChange} />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? 'Menyimpan…' : editId ? 'Simpan Perubahan' : 'Tambah'}
                </button>
                <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Batal</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.filters}>
          <div className={styles.tabs}>
            {['All', ...CATEGORIES].map(t => (
              <button key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.empty}>Memuat data…</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Produk</th><th>Kategori</th><th>Harga</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.productThumb}>
                          {p.image_url ? (
                            <img src={resolveImageUrl(p.image_url)} alt={p.name} />
                          ) : (
                            <span>📦</span>
                          )}
                        </div>
                        <span className={styles.productName}>{p.name}</span>
                      </div>
                    </td>
                    <td><span className={styles.catBadge}>{p.category}</span></td>
                    <td className={styles.priceCell}>{formatPrice(p.price)}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              {editId ? 'Simpan perubahan produk ini?' : 'Tambah produk baru ini?'}
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.confirmYes} onClick={handleConfirmSave} disabled={saving}>
                {saving ? 'Menyimpan…' : 'Ya, Simpan'}
              </button>
              <button className={styles.confirmNo} onClick={handleCancelConfirm}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

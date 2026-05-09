const router = require('express').Router()
const pool   = require('../db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const path   = require('path')
const fs     = require('fs')

// folder untuk simpan upload, di dalam public frontend agar langsung bisa diakses
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

function saveBase64Image(base64Data, existingFilename) {
  if (!base64Data || !base64Data.startsWith('data:')) return null
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/)
  if (!matches) return null
  const ext      = matches[1] === 'jpeg' ? 'jpg' : matches[1]
  const filename = existingFilename || `img_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filepath = path.join(uploadDir, filename)
  fs.writeFileSync(filepath, Buffer.from(matches[2], 'base64'))
  return `uploads/${filename}`
}

// GET /api/products/stats
router.get('/stats', async (req, res) => {
  try {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM products')
    const [byCategory]  = await pool.query('SELECT category, COUNT(*) as count FROM products GROUP BY category')
    res.json({ total, byCategory })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy, minPrice, maxPrice, minRating } = req.query
    let sql = 'SELECT * FROM v_products_full WHERE 1=1'
    const params = []
    if (category && category !== 'All') { sql += ' AND category = ?'; params.push(category) }
    if (search)    { sql += ' AND name LIKE ?';   params.push(`%${search}%`) }
    if (minPrice)  { sql += ' AND price >= ?';    params.push(Number(minPrice)) }
    if (maxPrice)  { sql += ' AND price <= ?';    params.push(Number(maxPrice)) }
    if (minRating && Number(minRating) > 0) { sql += ' AND avg_rating >= ?'; params.push(Number(minRating)) }
    switch (sortBy) {
      case 'price_asc':   sql += ' ORDER BY price ASC';  break
      case 'price_desc':  sql += ' ORDER BY price DESC'; break
      case 'rating_desc': sql += ' ORDER BY avg_rating DESC'; break
      case 'rating_asc':  sql += ' ORDER BY avg_rating ASC';  break
      default:            sql += ' ORDER BY id ASC'
    }
    const [rows] = await pool.query(sql, params)
    const products = rows.map(p => ({
      ...p,
      details: typeof p.details === 'string' ? JSON.parse(p.details) : (p.details || [])
    }))
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM v_products_full WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Produk tidak ditemukan' })
    const p = rows[0]
    p.details = typeof p.details === 'string' ? JSON.parse(p.details) : (p.details || [])
    res.json(p)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/products
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, category, shopee_url, details, is_bestseller, image_url } = req.body
    const detailsArr  = Array.isArray(details) ? details : (details ? JSON.parse(details) : [])
    const detailsJson = JSON.stringify(detailsArr)

    let finalImage = image_url || null
    if (finalImage && finalImage.startsWith('data:')) {
      finalImage = saveBase64Image(finalImage, null)
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, price, category, image_url, shopee_url, details, is_bestseller) VALUES (?,?,?,?,?,?,?)',
      [name, price, category, finalImage, shopee_url || 'https://shopee.co.id', detailsJson, is_bestseller ? 1 : 0]
    )
    res.json({ id: result.insertId, message: 'Produk berhasil ditambahkan' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// PUT /api/products/:id
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, price, category, shopee_url, details, is_bestseller, image_url } = req.body
    const detailsArr  = Array.isArray(details) ? details : (details ? JSON.parse(details) : [])
    const detailsJson = JSON.stringify(detailsArr)

    // Tentukan gambar: base64 baru → simpan file | URL lama → pakai langsung | undefined → ambil dari DB
    let finalImage
    if (image_url && image_url.startsWith('data:')) {
      finalImage = saveBase64Image(image_url, null)
    } else if (image_url) {
      finalImage = image_url
    } else {
      const [rows] = await pool.query('SELECT image_url FROM products WHERE id=?', [req.params.id])
      finalImage = rows[0]?.image_url || null
    }

    await pool.query(
      'UPDATE products SET name=?, price=?, category=?, image_url=?, shopee_url=?, details=?, is_bestseller=? WHERE id=?',
      [name, price, category, finalImage, shopee_url || 'https://shopee.co.id', detailsJson, is_bestseller ? 1 : 0, req.params.id]
    )
    res.json({ message: 'Produk berhasil diupdate' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// DELETE /api/products/:id
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    res.json({ message: 'Produk berhasil dihapus' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router

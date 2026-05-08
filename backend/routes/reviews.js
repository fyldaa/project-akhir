const router = require('express').Router()
const pool   = require('../db')
const { authMiddleware } = require('../middleware/auth')

// 1. GET /api/reviews/:productId
// Mengambil semua ulasan untuk satu produk tertentu (untuk halaman detail produk)
router.get('/:productId', async (req, res) => {
  try {
    const pId = req.params.productId;
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ${pId}
       ORDER BY r.created_at DESC`
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 2. GET /api/reviews/user/:id (INI YANG BIKIN NYAMBUNG KE DASHBOARD)
// Mengambil semua ulasan yang pernah dibuat oleh user tertentu berdasarkan ID
router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.query(
      `SELECT r.*, p.name AS product_name, p.category, p.image_url
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ${userId}
       ORDER BY r.created_at DESC`
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 3. GET /api/reviews/user/me
// Mengambil ulasan milik user yang sedang login (menggunakan token)
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, p.name AS product_name, p.category, p.image_url
       FROM reviews r
       JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ${req.user.id}
       ORDER BY r.created_at DESC`
    )
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 4. POST /api/reviews/:productId
// Menambah atau memperbarui ulasan produk
router.post('/:productId', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const pId = req.params.productId;
    const uId = req.user.id;

    if (!rating || !comment) return res.status(400).json({ error: 'Rating dan komentar wajib diisi' })

    await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES (${pId}, ${uId}, ${rating}, '${comment}')
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = NOW()`
    )
    res.json({ message: 'Ulasan berhasil disimpan' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// 5. DELETE /api/reviews/:reviewId
// Menghapus ulasan (hanya pemilik atau admin)
router.delete('/:reviewId', authMiddleware, async (req, res) => {
  try {
    const rId = req.params.reviewId;
    const [rows] = await pool.query(`SELECT * FROM reviews WHERE id = ${rId}`)
    
    if (!rows.length) return res.status(404).json({ error: 'Ulasan tidak ditemukan' })

    if (rows[0].user_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ error: 'Tidak diizinkan' })
    }

    await pool.query(`DELETE FROM reviews WHERE id = ${rId}`)
    res.json({ message: 'Ulasan berhasil dihapus' })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
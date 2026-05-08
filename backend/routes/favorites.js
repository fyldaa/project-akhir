const router = require('express').Router()
const pool   = require('../db')
const { authMiddleware } = require('../middleware/auth')

// --- 1. PINDAHKAN /ids KE ATAS ---
// Supaya Express tidak mengira "ids" adalah sebuah ":id"
router.get('/ids', authMiddleware, async (req, res) => {
  try {
    const uId = req.user.id;
    
    // Proteksi jika uId tidak ada
    if (!uId) return res.json([]);

    const [rows] = await pool.query(
      `SELECT product_id FROM favorites WHERE user_id = ${uId}`
    )
    
    // Pastikan hasil selalu array ID [1, 2, 3]
    res.json(rows.map(r => r.product_id))
  } catch (e) {
    console.error("Error di /ids:", e.message);
    res.status(500).json({ error: e.message })
  }
})

// --- 2. GET FAVORIT USER LOGIN (Pake Token) ---
router.get('/', authMiddleware, async (req, res) => {
  try {
    const uId = req.user.id;
    const [rows] = await pool.query(
      `SELECT p.* FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ${uId}
       ORDER BY f.created_at DESC`
    )
    const products = rows.map(p => ({
      ...p,
      details: typeof p.details === 'string' ? JSON.parse(p.details) : (p.details || [])
    }))
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// --- 3. GET FAVORIT BERDASARKAN ID (Untuk Dashboard) ---
// Rute dengan parameter :id HARUS di bawah rute statis seperti /ids
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Jika userId bukan angka, abaikan saja (biar ga error SQL)
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid ID" });

    const [rows] = await pool.query(
      `SELECT p.* FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.user_id = ${userId}
       ORDER BY f.created_at DESC`
    )
    
    const products = rows.map(p => ({
      ...p,
      details: typeof p.details === 'string' ? JSON.parse(p.details) : (p.details || [])
    }))
    
    res.json(products)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// --- 4. POST TOGGLE FAVORITE ---
router.post('/:productId', authMiddleware, async (req, res) => {
  try {
    const uId = req.user.id;
    const pId = req.params.productId;

    const [exist] = await pool.query(
      `SELECT id FROM favorites WHERE user_id = ${uId} AND product_id = ${pId}`
    )

    if (exist.length) {
      await pool.query(`DELETE FROM favorites WHERE user_id = ${uId} AND product_id = ${pId}`)
      res.json({ favorited: false, message: 'Dihapus dari favorit' })
    } else {
      await pool.query(`INSERT INTO favorites (user_id, product_id) VALUES (${uId}, ${pId})`)
      res.json({ favorited: true, message: 'Ditambahkan ke favorit' })
    }
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
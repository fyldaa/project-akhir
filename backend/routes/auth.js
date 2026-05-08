const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const pool    = require('../db')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Semua field wajib diisi' })

    const [exist] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (exist.length) return res.status(409).json({ error: 'Email sudah terdaftar' })

    const hash = await bcrypt.hash(password, 10)
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    )
    const token = jwt.sign(
      { id: result.insertId, name, email, is_admin: false },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    )
    res.json({ token, user: { id: result.insertId, name, email, is_admin: false } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email dan password wajib diisi' })

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ error: 'Email atau password salah' })

    const user = rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Email atau password salah' })

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    )
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin }
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/auth/login-free (login bebas tanpa password check)
router.post('/login-free', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ error: 'Email wajib diisi' })

    // Cek apakah sudah ada user dengan email ini
    let [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
    let user

    if (rows.length) {
      user = rows[0]
      // Jika admin, cek password
      if (user.is_admin) {
        const match = await bcrypt.compare(password || '', user.password)
        if (!match) return res.status(401).json({ error: 'Password admin salah' })
      }
    } else {
      // Auto-register user baru
      const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      const hash = await bcrypt.hash(password || 'default', 10)
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hash]
      )
      user = { id: result.insertId, name, email, is_admin: 0 }
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    )
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin }
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
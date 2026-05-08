const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' })
  }
  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token tidak valid' })
  }
}

const adminMiddleware = (req, res, next) => {
  if (!req.user?.is_admin) return res.status(403).json({ error: 'Akses ditolak' })
  next()
}

module.exports = { authMiddleware, adminMiddleware }
require('dotenv').config()
const express  = require('express')
const cors     = require('cors')
const path     = require('path')

const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve file upload statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth',     require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/reviews',  require('./routes/reviews'))
app.use('/api/favorites',require('./routes/favorites'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Charmevely API running' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`))

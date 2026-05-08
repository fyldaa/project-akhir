const BASE = 'http://localhost:3001/api'

const getToken = () => localStorage.getItem('charmevely_token')

const headers = (withAuth = false) => {
  const h = { 'Content-Type': 'application/json' }
  if (withAuth) h['Authorization'] = `Bearer ${getToken()}`
  return h
}

const req = async (method, path, body, auth = false) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(auth),
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan')
  return data
}

// ── AUTH ───────────────────────────────────
export const loginFree    = (email, password)      => req('POST', '/auth/login-free', { email, password })
export const registerUser = (name, email, password) => req('POST', '/auth/register', { name, email, password })

// ── PRODUCTS ───────────────────────────────
export const getProducts    = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return req('GET', `/products${qs ? '?' + qs : ''}`)
}
export const getProduct     = (id)          => req('GET',    `/products/${id}`)
export const getBestsellers = ()            => req('GET',    '/products?bestseller=1')
export const createProduct  = (data)        => req('POST',   '/products', data, true)
export const updateProduct  = (id, data)    => req('PUT',    `/products/${id}`, data, true)
export const deleteProduct  = (id)          => req('DELETE', `/products/${id}`, null, true)

// ── REVIEWS ────────────────────────────────
export const getReviews     = (productId)           => req('GET',    `/reviews/${productId}`)
export const getMyReviews   = ()                    => req('GET',    '/reviews/user/me', null, true)
export const addReview      = (productId, data)     => req('POST',   `/reviews/${productId}`, data, true)
export const deleteReview   = (reviewId)            => req('DELETE', `/reviews/${reviewId}`, null, true)

// ── FAVORITES ──────────────────────────────
export const getFavorites   = ()            => req('GET',  '/favorites',      null, true)
export const getFavIds      = ()            => req('GET',  '/favorites/ids',  null, true)
export const toggleFavorite = (productId)  => req('POST', `/favorites/${productId}`, null, true)
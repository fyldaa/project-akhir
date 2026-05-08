import { createContext, useContext, useState } from 'react'

const ReviewContext = createContext(null)

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState(() => {
    try { return JSON.parse(localStorage.getItem('charmevely_reviews')) || {} } catch { return {} }
  })
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('charmevely_favs')) || {} } catch { return {} }
  })

  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val))

  const addReview = (productId, user, rating, comment) => {
    const pid = String(productId)
    const uid = String(user.id)
    const existing = reviews[pid] || []
    const filtered = existing.filter(r => String(r.userId) !== uid)
    const newReview = {
      id: Date.now(),
      userId: uid,
      userName: user.name,
      rating,
      comment,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    }
    const updated = { ...reviews, [pid]: [newReview, ...filtered] }
    setReviews(updated)
    save('charmevely_reviews', updated)
  }

  const deleteReview = (productId, reviewId) => {
    const pid = String(productId)
    const updated = { ...reviews, [pid]: (reviews[pid] || []).filter(r => r.id !== reviewId) }
    setReviews(updated)
    save('charmevely_reviews', updated)
  }

  const getReviews   = (productId) => reviews[String(productId)] || []
  const getAvgRating = (productId) => {
    const list = getReviews(productId)
    if (!list.length) return 0
    return (list.reduce((s, r) => s + r.rating, 0) / list.length).toFixed(1)
  }

  const toggleFav = (userId, productId) => {
    const uid  = String(userId)
    const curr = favs[uid] || []
    const next = curr.includes(productId) ? curr.filter(id => id !== productId) : [...curr, productId]
    const updated = { ...favs, [uid]: next }
    setFavs(updated)
    save('charmevely_favs', updated)
  }

  const isFav       = (userId, productId) => (favs[String(userId)] || []).includes(productId)
  const getUserFavs = (userId) => favs[String(userId)] || []

  const getUserReviews = (userId) => {
    const uid = String(userId)
    const all = []
    Object.entries(reviews).forEach(([pid, list]) => {
      list.forEach(r => { if (String(r.userId) === uid) all.push({ ...r, productId: Number(pid) }) })
    })
    return all
  }

  return (
    <ReviewContext.Provider value={{ addReview, deleteReview, getReviews, getAvgRating, toggleFav, isFav, getUserFavs, getUserReviews }}>
      {children}
    </ReviewContext.Provider>
  )
}

export const useReview = () => useContext(ReviewContext)
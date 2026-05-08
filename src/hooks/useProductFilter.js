// hooks/useProductFilter.js
// Reusable hook: filter + sort produk berdasarkan kategori, harga, rating, search

import { useState, useMemo } from 'react'

const DEFAULT_FILTERS = {
  category : 'All',
  search   : '',
  sortBy   : 'default',   // default | price_asc | price_desc | rating_desc | rating_asc
  minPrice : '',
  maxPrice : '',
  minRating: 0,
}

/**
 * @param {Array}    products  - array produk mentah
 * @param {Function} getRating - fn(productId) => avgRating (dari ReviewContext)
 */
export function useProductFilter(products, getRating = () => 0) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    let list = [...products]

    // 1. Filter kategori
    if (filters.category !== 'All')
      list = list.filter(p => p.category === filters.category)

    // 2. Filter search
    if (filters.search.trim())
      list = list.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      )

    // 3. Filter rentang harga
    if (filters.minPrice !== '')
      list = list.filter(p => p.price >= Number(filters.minPrice))
    if (filters.maxPrice !== '')
      list = list.filter(p => p.price <= Number(filters.maxPrice))

    // 4. Filter min rating
    if (filters.minRating > 0)
      list = list.filter(p => getRating(p.id) >= filters.minRating)

    // 5. Sort
    switch (filters.sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating_desc':
        list.sort((a, b) => getRating(b.id) - getRating(a.id))
        break
      case 'rating_asc':
        list.sort((a, b) => getRating(a.id) - getRating(b.id))
        break
      default:
        break
    }

    return list
  }, [products, filters, getRating])

  return { filters, setFilters, filtered }
}
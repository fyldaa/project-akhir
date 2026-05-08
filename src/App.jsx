import { Routes, Route } from 'react-router-dom'
import Home          from './pages/Home/Home'
import Category      from './pages/Category/Category'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Contact       from './pages/Contact/Contact'
import SignIn        from './pages/SignIn/SignIn'
import Register      from './pages/Register/Register'
import Admin         from './pages/Admin/Admin'
import UserDashboard from './pages/UserDashboard/UserDashboard'

function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/category"    element={<Category />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/contact"     element={<Contact />} />
      <Route path="/signin"      element={<SignIn />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/admin"       element={<Admin />} />
      <Route path="/dashboard"   element={<UserDashboard />} />
    </Routes>
  )
}

export default App
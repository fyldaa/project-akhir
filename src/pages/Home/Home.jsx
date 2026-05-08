import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/Hero/Hero'
import CategorySection from '../../components/CategorySection/CategorySection'
import Lifestyle from '../../components/Lifestyle/Lifestyle'
import BestSeller from '../../components/BestSeller/BestSeller'
import Footer from '../../components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        <Lifestyle />
        <BestSeller />
      </main>
      <Footer />
    </>
  )
}

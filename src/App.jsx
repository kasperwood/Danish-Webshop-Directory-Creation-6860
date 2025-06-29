import React,{useEffect} from 'react'
import {HashRouter as Router,Routes,Route} from 'react-router-dom'
import {motion} from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedShops from './components/FeaturedShops'
import Categories from './components/Categories'
import BlogSection from './components/BlogSection'
import Footer from './components/Footer'
import CategoryPage from './components/CategoryPage'
import BlogPage from './components/BlogPage'
import BlogPost from './components/BlogPost'
import SearchPage from './components/SearchPage'
import Disclaimer from './components/Disclaimer'
import SEOHead from './components/SEOHead'
import AdminPanel from './components/admin/AdminPanel'
import CodeSnippetsRenderer from './components/CodeSnippetsRenderer'
import {initAnalytics} from './utils/analytics'
import './App.css'

function HomePage() {
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.5}}
    >
      <SEOHead
        title="ShopDK - Find Danmarks Bedste Webshops | Sammenlign Priser & Tilbud"
        description="Danmarks største webshop directory med over 1000+ verificerede webshops. Find de bedste tilbud,sammenlign priser og læs Trustpilot anmeldelser."
        keywords="danske webshops,online shopping,e-handel Danmark,sammenlign priser,webshop anmeldelser,trustpilot"
      />
      <Hero />
      <FeaturedShops />
      <Categories />
      <BlogSection />
    </motion.div>
  )
}

function App() {
  useEffect(()=> {
    // Initialize analytics tracking
    initAnalytics()
  },[])

  return (
    <Router>
      <Routes>
        {/* Admin Routes - Now publicly accessible */}
        <Route path="/admin/*" element={<AdminPanel />} />
        
        {/* Public Routes */}
        <Route path="/*" element={
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Disclaimer />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/kategori/:categorySlug" element={<CategoryPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/search" element={<SearchPage />} />
              </Routes>
            </main>
            <Footer />
            {/* Code Snippets Renderer */}
            <CodeSnippetsRenderer />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
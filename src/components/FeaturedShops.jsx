import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import {trackWebshopClick} from '../utils/analytics'
import supabase from '../lib/supabase'

const {FiExternalLink,FiCheck,FiFilter}=FiIcons

const FeaturedShops=()=> {
  const [shops,setShops]=useState([])
  const [filteredShops,setFilteredShops]=useState([])
  const [categories,setCategories]=useState([])
  const [selectedCategory,setSelectedCategory]=useState('')
  const [loading,setLoading]=useState(true)

  useEffect(()=> {
    fetchFeaturedShops()
    fetchCategories()
  },[])

  useEffect(()=> {
    filterShops()
  },[shops,selectedCategory])

  const fetchFeaturedShops=async ()=> {
    try {
      const {data,error}=await supabase
        .from('webshops_dk847392')
        .select('*')
        .eq('featured',true)
        .eq('status','active')
        .order('sort_order',{ascending: true})

      if (!error && data) {
        setShops(data)
      }
    } catch (error) {
      console.error('Error fetching featured shops:',error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories=async ()=> {
    try {
      const {data,error}=await supabase
        .from('categories_dk847392')
        .select('name,slug')
        .eq('status','active')
        .order('sort_order')

      if (!error && data) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:',error)
    }
  }

  const filterShops=()=> {
    if (!selectedCategory) {
      setFilteredShops(shops)
    } else {
      setFilteredShops(shops.filter(shop=>
        shop.categories && shop.categories.includes(selectedCategory)
      ))
    }
  }

  const handleWebshopClick=(shop)=> {
    // Track the click
    trackWebshopClick(shop.name,shop.id)
  }

  const getCategoryName=(categorySlug)=> {
    const category=categories.find(cat=> cat.slug===categorySlug)
    return category?.name || categorySlug
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (shops.length===0) {
    return null // Don't show section if no featured shops
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.6}}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Udvalgte webshops
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lige nu anbefaler vi disse webshops
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
            <button
              onClick={()=> setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              Alle ({shops.length})
            </button>
            {categories.map((category)=> {
              const categoryShops=shops.filter(shop=>
                shop.categories && shop.categories.includes(category.slug)
              )
              if (categoryShops.length===0) return null

              return (
                <button
                  key={category.slug}
                  onClick={()=> setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory===category.slug
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  {category.name} ({categoryShops.length})
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredShops.map((shop,index)=> (
            <motion.div
              key={shop.id}
              initial={{opacity: 0,y: 20}}
              animate={{opacity: 1,y: 0}}
              transition={{duration: 0.6,delay: index * 0.1}}
              whileHover={{y: -5}}
              className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                {/* Running Headline - News Ticker Style */}
                {shop.headline_active && shop.headline_text && (
                  <div className="mb-3 overflow-hidden rounded-md" style={{backgroundColor: shop.headline_bg_color || '#ff0000'}}>
                    <div className="relative">
                      <div
                        className="text-xs font-bold py-1 px-2 whitespace-nowrap animate-marquee"
                        style={{
                          color: shop.headline_color || '#ffffff',
                          animation: `marquee ${shop.headline_speed || 10}s linear infinite`,
                          animationDelay: `${index * 0.5}s`
                        }}
                      >
                        {shop.headline_text}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2 shadow-sm">
                      <img
                        src={shop.logo_url}
                        alt={shop.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e)=> {
                          e.target.style.display='none'
                          e.target.nextSibling.style.display='flex'
                        }}
                      />
                      <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {shop.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={shop.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={()=> handleWebshopClick(shop)}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {shop.name}
                        </a>
                        {shop.danish_based && (
                          <div className="w-4 h-3 rounded-sm overflow-hidden" title="Dansk webshop">
                            <svg viewBox="0 0 37 28" className="w-full h-full">
                              <rect width="37" height="28" fill="#c8102e"/>
                              <rect x="12" y="0" width="4" height="28" fill="white"/>
                              <rect x="0" y="12" width="37" height="4" fill="white"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        {shop.categories && shop.categories.length > 0 ? (
                          <Link
                            to={`/kategori/${shop.categories[0]}`}
                            className="hover:text-blue-800 transition-colors"
                          >
                            {getCategoryName(shop.categories[0])}
                          </Link>
                        ) : (
                          'Diverse'
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certification and Payment Icons - Centered */}
                {(shop.emaerket || shop.tryghedsmaerket || shop.mobilepay_accepted) && (
                  <div className="flex justify-center gap-3 mb-4 flex-wrap">
                    {shop.emaerket && (
                      <div className="h-8 flex items-center justify-center" title="e-mærket certificeret">
                        <img
                          src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203502220-e-maerket.png"
                          alt="e-mærket certificeret"
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    )}
                    {shop.tryghedsmaerket && (
                      <div className="h-8 flex items-center justify-center" title="Tryghedsmærket certificeret">
                        <img
                          src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203517708-Sk%C3%83%C2%A6rmbillede%202025-06-29%20152338.png"
                          alt="Tryghedsmærket certificeret"
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    )}
                    {shop.mobilepay_accepted && (
                      <div className="h-8 flex items-center justify-center" title="Betal med MobilePay">
                        <img
                          src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751204103993-freepik_br_cb187d26-418d-4219-8093-3e2ea0dad2db.png"
                          alt="Betal med MobilePay"
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}

                <p className="text-gray-600 mb-4 text-sm">
                  {shop.description}
                </p>

                {/* Dynamic USP Items with Checkmarks */}
                <div className="space-y-2 mb-4">
                  {shop.usp_items && shop.usp_items.map((usp,uspIndex)=> (
                    <div key={uspIndex} className="flex items-center gap-2 text-sm text-gray-700">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{usp}</span>
                    </div>
                  ))}
                </div>

                {/* Show discount text only if it exists */}
                {shop.discount_text && shop.discount_text.trim() && (
                  <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-4 font-medium">
                    {shop.discount_text}
                  </div>
                )}

                <motion.a
                  href={shop.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={()=> handleWebshopClick(shop)}
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors mb-3"
                >
                  Besøg webshop
                  <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                </motion.a>

                {/* Show Trustpilot link only if URL exists */}
                {shop.trustpilot_url && shop.trustpilot_url.trim() && (
                  <div className="text-center">
                    <a
                      href={shop.trustpilot_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-blue-600 underline"
                    >
                      Se anmeldelser på Trustpilot
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredShops.length===0 && selectedCategory && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ingen udvalgte webshops i denne kategori.</p>
            <button
              onClick={()=> setSelectedCategory('')}
              className="mt-2 text-blue-600 hover:text-blue-700 underline"
            >
              Vis alle webshops
            </button>
          </div>
        )}
      </div>

      {/* Add CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default FeaturedShops
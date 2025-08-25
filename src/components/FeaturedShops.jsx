import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import {trackWebshopClick} from '../utils/analytics'
import supabase from '../lib/supabase'

const {FiExternalLink,FiCheck,FiFilter,FiStar,FiTrendingUp,FiThumbsUp}=FiIcons

const FeaturedShops=()=> {
  const [shops,setShops]=useState([])
  const [filteredShops,setFilteredShops]=useState([])
  const [categories,setCategories]=useState([])
  const [selectedCategory,setSelectedCategory]=useState('')
  const [loading,setLoading]=useState(true)
  const [popularShops, setPopularShops] = useState([])
  const [showPopular, setShowPopular] = useState(false)

  useEffect(()=> {
    fetchFeaturedShops()
    fetchPopularShops()
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

  const fetchPopularShops=async ()=> {
    try {
      const {data,error}=await supabase
        .from('webshops_dk847392')
        .select('*')
        .eq('status','active')
        .order('clicks_count',{ascending: false})
        .limit(10)

      if (!error && data) {
        setPopularShops(data.filter(shop => !shop.featured))
      }
    } catch (error) {
      console.error('Error fetching popular shops:',error)
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
    if (!selectedCategory || selectedCategory === '') {
      // Show all shops when "Alle" is selected or no category selected
      setFilteredShops(shops)
    } else {
      // Filter shops that have the selected category in their categories array
      const filtered = shops.filter(shop=> {
        if (!shop.categories || !Array.isArray(shop.categories)) {
          return false
        }
        return shop.categories.includes(selectedCategory)
      })
      setFilteredShops(filtered)
    }
  }

  const handleWebshopClick=(shop)=> {
    trackWebshopClick(shop.name,shop.id)
  }

  const getCategoryName=(categorySlug)=> {
    const category=categories.find(cat=> cat.slug===categorySlug)
    return category?.name || categorySlug
  }

  const getCountryFlag=(country)=> {
    switch (country) {
      case 'denmark':
        return (
          <div className="w-4 h-3 rounded-sm overflow-hidden" title="Dansk webshop">
            <svg viewBox="0 0 37 28" className="w-full h-full">
              <rect width="37" height="28" fill="#c8102e" />
              <rect x="12" y="0" width="4" height="28" fill="white" />
              <rect x="0" y="12" width="37" height="4" fill="white" />
            </svg>
          </div>
        )
      case 'norway':
        return (
          <div className="w-4 h-3 rounded-sm overflow-hidden" title="Norsk webshop">
            <svg viewBox="0 0 37 28" className="w-full h-full">
              <rect width="37" height="28" fill="#ef2b2d" />
              <rect x="12" y="0" width="4" height="28" fill="white" />
              <rect x="0" y="12" width="37" height="4" fill="white" />
              <rect x="12" y="0" width="2" height="28" fill="#002868" />
              <rect x="0" y="13" width="37" height="2" fill="#002868" />
            </svg>
          </div>
        )
      case 'sweden':
        return (
          <div className="w-4 h-3 rounded-sm overflow-hidden" title="Svensk webshop">
            <svg viewBox="0 0 37 28" className="w-full h-full">
              <rect width="37" height="28" fill="#006aa7" />
              <rect x="12" y="0" width="4" height="28" fill="#fecc00" />
              <rect x="0" y="12" width="37" height="4" fill="#fecc00" />
            </svg>
          </div>
        )
      default:
        if (country===true || country==='true') {
          return (
            <div className="w-4 h-3 rounded-sm overflow-hidden" title="Dansk webshop">
              <svg viewBox="0 0 37 28" className="w-full h-full">
                <rect width="37" height="28" fill="#c8102e" />
                <rect x="12" y="0" width="4" height="28" fill="white" />
                <rect x="0" y="12" width="37" height="4" fill="white" />
              </svg>
            </div>
          )
        }
        return null
    }
  }

  // Get categories that actually have featured shops
  const categoriesWithShops = categories.filter(category => {
    return shops.some(shop => 
      shop.categories && 
      Array.isArray(shop.categories) && 
      shop.categories.includes(category.slug)
    )
  })

  const toggleView = () => {
    setShowPopular(!showPopular);
  }

  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (shops.length===0 && popularShops.length===0) {
    return null
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{duration: 0.6}}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {showPopular ? "Populære webshops" : "Udvalgte webshops"}
          </h2>
          <button
            onClick={toggleView}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm transition-colors"
          >
            <SafeIcon icon={showPopular ? FiStar : FiTrendingUp} className="w-4 h-4" />
            <span>Vis {showPopular ? "udvalgte" : "populære"}</span>
          </button>
        </motion.div>

        {!showPopular && (
          <>
            {/* Category Filter - More Compact */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1.5 rounded-lg max-w-full overflow-x-auto">
                <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <button
                  onClick={()=> setSelectedCategory('')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    !selectedCategory ? 
                    'bg-blue-600 text-white' : 
                    'text-gray-600 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  Alle ({shops.length})
                </button>
                {categoriesWithShops.map((category)=> {
                  const categoryShops=shops.filter(shop=> 
                    shop.categories && 
                    shop.categories.includes(category.slug)
                  )
                  
                  return (
                    <button
                      key={category.slug}
                      onClick={()=> setSelectedCategory(category.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        selectedCategory===category.slug ? 
                        'bg-blue-600 text-white' : 
                        'text-gray-600 hover:text-blue-600 hover:bg-white'
                      }`}
                    >
                      {category.name} ({categoryShops.length})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Featured Shops Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredShops.map((shop,index)=> {
                // Check if we have certifications/icons to show
                const hasCertifications=shop.emaerket || shop.tryghedsmaerket || shop.mobilepay_accepted
                const hasUSP=shop.usp_items && shop.usp_items.length > 0 && shop.usp_items[0]?.trim()
                const hasDiscount=shop.discount_text && shop.discount_text.trim()

                return (
                  <motion.div
                    key={shop.id}
                    initial={{opacity: 0,y: 20}}
                    animate={{opacity: 1,y: 0}}
                    transition={{duration: 0.6,delay: index * 0.05}}
                    whileHover={{y: -2}}
                    className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    {/* Running Headline - Compact */}
                    <div className="h-5">
                      {shop.headline_active && shop.headline_text && (
                        <div
                          className="overflow-hidden h-full"
                          style={{backgroundColor: shop.headline_bg_color || '#ff0000'}}
                        >
                          <div
                            className="text-xs font-bold px-2 whitespace-nowrap animate-marquee h-full flex items-center"
                            style={{
                              color: shop.headline_color || '#ffffff',
                              animation: `marquee ${shop.headline_speed || 10}s linear infinite`,
                              animationDelay: `${index * 0.5}s`
                            }}
                          >
                            {shop.headline_text}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content - Improved Layout */}
                    <div className="flex-1 flex flex-col p-3">
                      {/* Header - Larger Icons and Names */}
                      <div className="h-20 mb-2">
                        <div className="flex items-start gap-3 h-full">
                          <div className="w-20 h-20 rounded bg-white flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                            <img
                              src={shop.logo_url}
                              alt={shop.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e)=> {
                                e.target.style.display='none'
                                e.target.nextSibling.style.display='flex'
                              }}
                            />
                            <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-lg">
                              {shop.name.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <a
                                href={shop.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={()=> handleWebshopClick(shop)}
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-base line-clamp-1"
                              >
                                {shop.name}
                              </a>
                              {getCountryFlag(shop.country || (shop.danish_based && 'denmark'))}
                            </div>
                            <div className="text-sm text-blue-600 font-medium line-clamp-1">
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

                      {/* Certifications - Only show if exists,closer spacing */}
                      {hasCertifications && (
                        <div className="h-6 flex justify-center items-center mb-2">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {shop.emaerket && (
                              <div className="h-6 flex items-center justify-center" title="e-mærket certificeret">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203502220-e-maerket.png"
                                  alt="e-mærket certificeret"
                                  className="h-6 w-auto object-contain"
                                />
                              </div>
                            )}
                            {shop.tryghedsmaerket && (
                              <div className="h-6 flex items-center justify-center" title="Tryghedsmærket certificeret">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203517708-Sk%C3%83%C2%A6rmbillede%202025-06-29%20152338.png"
                                  alt="Tryghedsmærket certificeret"
                                  className="h-6 w-auto object-contain"
                                />
                              </div>
                            )}
                            {shop.mobilepay_accepted && (
                              <div className="h-6 flex items-center justify-center" title="Betal med MobilePay">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751204103993-freepik_br_cb187d26-418d-4219-8093-3e2ea0dad2db.png"
                                  alt="Betal med MobilePay"
                                  className="h-6 w-auto object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* USP - Only show if exists */}
                      {hasUSP && (
                        <div className="h-4 mb-2">
                          <div className="flex items-center gap-1 text-xs text-gray-700">
                            <SafeIcon icon={FiCheck} className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <span className="line-clamp-1">{shop.usp_items[0]}</span>
                          </div>
                        </div>
                      )}

                      {/* Discount - Only show if exists */}
                      {hasDiscount && (
                        <div className="h-4 mb-2">
                          <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded font-medium text-center line-clamp-1">
                            {shop.discount_text}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button - Fixed at Bottom */}
                    <div className="p-3 pt-0">
                      <motion.a
                        href={shop.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={()=> handleWebshopClick(shop)}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors text-sm"
                      >
                        Besøg webshop
                        <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      </motion.a>
                      {shop.trustpilot_url && shop.trustpilot_url.trim() && (
                        <div className="text-center mt-1">
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
                )
              })}
            </div>

            {filteredShops.length===0 && selectedCategory && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Ingen udvalgte webshops i kategorien "{getCategoryName(selectedCategory)}".</p>
                <button
                  onClick={()=> setSelectedCategory('')}
                  className="mt-2 text-blue-600 hover:text-blue-700 underline text-sm"
                >
                  Vis alle webshops
                </button>
              </div>
            )}
          </>
        )}

        {showPopular && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {popularShops.map((shop, index) => {
                // Check if we have certifications/icons to show
                const hasCertifications = shop.emaerket || shop.tryghedsmaerket || shop.mobilepay_accepted;
                const hasUSP = shop.usp_items && shop.usp_items.length > 0 && shop.usp_items[0]?.trim();
                const hasDiscount = shop.discount_text && shop.discount_text.trim();

                return (
                  <motion.div
                    key={shop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0">
                      <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                        <SafeIcon icon={FiThumbsUp} className="w-3 h-3" />
                        <span>{shop.clicks_count || 0} klik</span>
                      </div>
                    </div>

                    {/* Running Headline - Compact */}
                    <div className="h-5">
                      {shop.headline_active && shop.headline_text && (
                        <div
                          className="overflow-hidden h-full"
                          style={{ backgroundColor: shop.headline_bg_color || '#ff0000' }}
                        >
                          <div
                            className="text-xs font-bold px-2 whitespace-nowrap animate-marquee h-full flex items-center"
                            style={{
                              color: shop.headline_color || '#ffffff',
                              animation: `marquee ${shop.headline_speed || 10}s linear infinite`,
                              animationDelay: `${index * 0.5}s`
                            }}
                          >
                            {shop.headline_text}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content - Improved Layout */}
                    <div className="flex-1 flex flex-col p-3">
                      {/* Header - Larger Icons and Names */}
                      <div className="h-20 mb-2">
                        <div className="flex items-start gap-3 h-full">
                          <div className="w-20 h-20 rounded bg-white flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                            <img
                              src={shop.logo_url}
                              alt={shop.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-lg">
                              {shop.name.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                              <a
                                href={shop.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleWebshopClick(shop)}
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors text-base line-clamp-1"
                              >
                                {shop.name}
                              </a>
                              {getCountryFlag(shop.country || (shop.danish_based && 'denmark'))}
                            </div>
                            <div className="text-sm text-blue-600 font-medium line-clamp-1">
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

                      {/* Certifications - Only show if exists,closer spacing */}
                      {hasCertifications && (
                        <div className="h-6 flex justify-center items-center mb-2">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {shop.emaerket && (
                              <div className="h-6 flex items-center justify-center" title="e-mærket certificeret">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203502220-e-maerket.png"
                                  alt="e-mærket certificeret"
                                  className="h-6 w-auto object-contain"
                                />
                              </div>
                            )}
                            {shop.tryghedsmaerket && (
                              <div className="h-6 flex items-center justify-center" title="Tryghedsmærket certificeret">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203517708-Sk%C3%83%C2%A6rmbillede%202025-06-29%20152338.png"
                                  alt="Tryghedsmærket certificeret"
                                  className="h-6 w-auto object-contain"
                                />
                              </div>
                            )}
                            {shop.mobilepay_accepted && (
                              <div className="h-6 flex items-center justify-center" title="Betal med MobilePay">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751204103993-freepik_br_cb187d26-418d-4219-8093-3e2ea0dad2db.png"
                                  alt="Betal med MobilePay"
                                  className="h-6 w-auto object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* USP - Only show if exists */}
                      {hasUSP && (
                        <div className="h-4 mb-2">
                          <div className="flex items-center gap-1 text-xs text-gray-700">
                            <SafeIcon icon={FiCheck} className="w-3 h-3 text-green-600 flex-shrink-0" />
                            <span className="line-clamp-1">{shop.usp_items[0]}</span>
                          </div>
                        </div>
                      )}

                      {/* Discount - Only show if exists */}
                      {hasDiscount && (
                        <div className="h-4 mb-2">
                          <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded font-medium text-center line-clamp-1">
                            {shop.discount_text}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Button - Fixed at Bottom */}
                    <div className="p-3 pt-0">
                      <motion.a
                        href={shop.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleWebshopClick(shop)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors text-sm"
                      >
                        Besøg webshop
                        <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      </motion.a>
                      {shop.trustpilot_url && shop.trustpilot_url.trim() && (
                        <div className="text-center mt-1">
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
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </section>
  )
}

export default FeaturedShops
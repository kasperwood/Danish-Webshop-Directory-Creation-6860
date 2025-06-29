import React,{useState,useEffect} from 'react'
import {Link,useParams} from 'react-router-dom'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import SEOHead from './SEOHead'
import Breadcrumbs from './Breadcrumbs'
import {trackWebshopClick} from '../utils/analytics'
import supabase from '../lib/supabase'

const {FiFilter,FiGrid,FiList,FiExternalLink,FiTrendingUp,FiCheck}=FiIcons

const CategoryPage=()=> {
  const {categorySlug}=useParams()
  const [viewMode,setViewMode]=useState('grid')
  const [sortBy,setSortBy]=useState('popular')
  const [shops,setShops]=useState([])
  const [categories,setCategories]=useState([])
  const [loading,setLoading]=useState(true)

  const categoryNames={
    'herremode': 'Herremode',
    'damemode': 'Damemode',
    'boern': 'Børn',
    'sport-og-fritid': 'Sport og fritid',
    'hjemmet': 'Hjemmet',
    'elektronik': 'Elektronik',
    'voksen': 'Voksen',
    'mad-og-drikke': 'Mad og drikke',
    'rejser-og-oplevelser': 'Rejser og oplevelser'
  }

  useEffect(()=> {
    // Scroll to top when category changes
    window.scrollTo({top: 0,behavior: 'smooth'})
    fetchCategoryShops()
    fetchCategories()
  },[categorySlug])

  const fetchCategoryShops=async ()=> {
    try {
      const {data,error}=await supabase
        .from('webshops_dk847392')
        .select('*')
        .eq('status','active')
        .contains('categories',[categorySlug])
        .order('sort_order',{ascending: true})

      if (!error && data) {
        setShops(data)
      }
    } catch (error) {
      console.error('Error fetching category shops:',error)
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

  // Filter and sort shops
  const getFilteredAndSortedShops=()=> {
    let filteredShops=[...shops]

    // Apply filters based on sortBy
    switch (sortBy) {
      case 'danish':
        filteredShops=filteredShops.filter(shop=> shop.danish_based)
        break
      case 'emaerket':
        filteredShops=filteredShops.filter(shop=> shop.emaerket)
        break
      case 'tryghedsmaerket':
        filteredShops=filteredShops.filter(shop=> shop.tryghedsmaerket)
        break
      case 'mobilepay':
        filteredShops=filteredShops.filter(shop=> shop.mobilepay_accepted)
        break
      case 'popular':
      default:
        // Keep default sort order (by sort_order)
        break
    }

    return filteredShops
  }

  const filteredShops=getFilteredAndSortedShops()
  const categoryName=categoryNames[categorySlug] || 'Kategori'

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
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`${categoryName} Webshops - Find de Bedste | ShopDK`}
        description={`Udforsk de bedste ${categoryName.toLowerCase()} webshops i Danmark. Sammenlign priser,læs anmeldelser og find de bedste tilbud på ${categoryName.toLowerCase()} produkter.`}
        keywords={`${categoryName.toLowerCase()},danske webshops,online shopping,${categoryName.toLowerCase()} tilbud`}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.6}}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {categoryName} webshops
            </h1>
            <p className="text-gray-600">
              Find de bedste webshops inden for {categoryName.toLowerCase()}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              {filteredShops.length} webshops fundet
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
              <SafeIcon icon={FiFilter} className="w-4 h-4" />
              Filtre
            </button>
            <select
              value={sortBy}
              onChange={(e)=> setSortBy(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Mest populære</option>
              <option value="danish">Dansk webshop</option>
              <option value="emaerket">e-mærket certificeret</option>
              <option value="tryghedsmaerket">Tryghedsmærket</option>
              <option value="mobilepay">MobilePay accepteret</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Vis som:</span>
            <button
              onClick={()=> setViewMode('grid')}
              className={`p-2 rounded ${viewMode==='grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={()=> setViewMode('list')}
              className={`p-2 rounded ${viewMode==='list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shops Grid */}
        <div className={`grid gap-6 ${viewMode==='grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredShops.map((shop,index)=> (
            <motion.div
              key={shop.id}
              initial={{opacity: 0,y: 20}}
              animate={{opacity: 1,y: 0}}
              transition={{duration: 0.6,delay: index * 0.1}}
              whileHover={{y: -5}}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                viewMode==='list' ? 'flex' : ''
              }`}
            >
              <div className={`p-6 ${viewMode==='list' ? 'flex-1' : ''}`}>
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
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2">
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
                        {shop.special_offer && (
                          <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-orange-500" />
                        )}
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

                {/* Dynamic USP's with Checkmarks */}
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
                  <div className="space-y-2 mb-4">
                    <div className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-lg font-medium">
                      {shop.discount_text}
                    </div>
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

        {/* No results message */}
        {filteredShops.length===0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ingen webshops fundet i denne kategori.</p>
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
    </div>
  )
}

export default CategoryPage
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
      console.log('🔍 Fetching shops for category:', categorySlug)
      
      const {data,error}=await supabase
        .from('webshops_dk847392')
        .select('*')
        .eq('status','active')
        .contains('categories',[categorySlug])
        .order('sort_order',{ascending: true})

      if (!error && data) {
        console.log('✅ Found shops:', data.length)
        setShops(data)
      } else if (error) {
        console.error('❌ Error fetching shops:', error)
      }
    } catch (error) {
      console.error('💥 Error fetching category shops:',error)
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
        filteredShops=filteredShops.filter(shop=> 
          shop.country==='denmark' || shop.danish_based
        )
        break
      case 'norwegian':
        filteredShops=filteredShops.filter(shop=> 
          shop.country==='norway'
        )
        break
      case 'swedish':
        filteredShops=filteredShops.filter(shop=> 
          shop.country==='sweden'
        )
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
    return category?.name || categoryNames[categorySlug] || categorySlug
  }

  // Get country flag component
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
        // Legacy support for danish_based field
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.6}}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm">
              <SafeIcon icon={FiFilter} className="w-4 h-4" />
              Filtre
            </button>
            <select
              value={sortBy}
              onChange={(e)=> setSortBy(e.target.value)}
              className="bg-white px-3 sm:px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="popular">Mest populære</option>
              <option value="danish">Dansk webshop</option>
              <option value="norwegian">Norsk webshop</option>
              <option value="swedish">Svensk webshop</option>
              <option value="emaerket">e-mærket certificeret</option>
              <option value="tryghedsmaerket">Tryghedsmærket</option>
              <option value="mobilepay">MobilePay accepteret</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Vis som:</span>
            <button
              onClick={()=> setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode==='grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={()=> setViewMode('list')}
              className={`p-2 rounded ${
                viewMode==='list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shops Grid */}
        <div className={`grid gap-4 sm:gap-6 ${
          viewMode==='grid' ? 
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 
          'grid-cols-1'
        }`}>
          {filteredShops.map((shop,index)=> {
            // Check if we have certifications/icons to show
            const hasCertifications=shop.emaerket || shop.tryghedsmaerket || shop.mobilepay_accepted
            const hasUSP=shop.usp_items && shop.usp_items.length > 0 && shop.usp_items[0]?.trim()
            const hasDiscount=shop.discount_text && shop.discount_text.trim()
            const hasDescription=shop.description && shop.description.trim()

            return (
              <motion.div
                key={shop.id}
                initial={{opacity: 0,y: 20}}
                animate={{opacity: 1,y: 0}}
                transition={{duration: 0.6,delay: index * 0.1}}
                whileHover={{y: -3}}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{
                  display: 'flex',
                  flexDirection: viewMode==='list' ? 'row' : 'column',
                  height: '100%'
                }}
              >
                {/* Content Container */}
                <div className={`flex-1 flex ${
                  viewMode==='list' ? 'flex-row' : 'flex-col'
                } p-4 sm:p-5`}>
                  
                  {/* Running Headline - Compact Height */}
                  <div className={`${viewMode==='list' ? 'w-full' : ''} h-6 mb-2`}>
                    {shop.headline_active && shop.headline_text && (
                      <div
                        className="overflow-hidden rounded h-full"
                        style={{backgroundColor: shop.headline_bg_color || '#ff0000'}}
                      >
                        <div className="relative">
                          <div
                            className="text-xs font-bold py-1 px-2 whitespace-nowrap animate-marquee h-full flex items-center"
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
                  </div>

                  {/* Main Content Area */}
                  <div className={`flex-1 flex ${
                    viewMode==='list' ? 'flex-row gap-6' : 'flex-col'
                  }`}>
                    
                    {/* Header Section */}
                    <div className={`${viewMode==='list' ? 'min-w-0 flex-1' : ''}`}>
                      {/* Shop Info - Larger Icons and Names */}
                      <div className="h-24 mb-2">
                        <div className="flex items-start gap-3 h-full">
                          <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center p-3 flex-shrink-0">
                            <img
                              src={shop.logo_url}
                              alt={shop.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e)=> {
                                e.target.style.display='none'
                                e.target.nextSibling.style.display='flex'
                              }}
                            />
                            <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-xl">
                              {shop.name.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <a
                                href={shop.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={()=> handleWebshopClick(shop)}
                                className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-xl line-clamp-1"
                              >
                                {shop.name}
                              </a>
                              {shop.special_offer && (
                                <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-orange-500" />
                              )}
                              {getCountryFlag(shop.country || (shop.danish_based && 'denmark'))}
                            </div>
                            <div className="text-base text-blue-600 font-medium line-clamp-1">
                              {/* Always show the current category being viewed */}
                              <span className="text-blue-600">
                                {categoryName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Certification and Payment Icons - Only show if exists */}
                      {hasCertifications && (
                        <div className="h-8 flex justify-center items-center mb-2">
                          <div className="flex justify-center gap-2 flex-wrap">
                            {shop.emaerket && (
                              <div className="h-8 flex items-center justify-center" title="e-mærket certificeret">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203502220-e-maerket.png"
                                  alt="e-mærket certificeret"
                                  className="h-7 w-auto object-contain"
                                />
                              </div>
                            )}
                            {shop.tryghedsmaerket && (
                              <div className="h-8 flex items-center justify-center" title="Tryghedsmærket certificeret">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751203517708-Sk%C3%83%C2%A6rmbillede%202025-06-29%20152338.png"
                                  alt="Tryghedsmærket certificeret"
                                  className="h-7 w-auto object-contain"
                                />
                              </div>
                            )}
                            {shop.mobilepay_accepted && (
                              <div className="h-8 flex items-center justify-center" title="Betal med MobilePay">
                                <img
                                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751204103993-freepik_br_cb187d26-418d-4219-8093-3e2ea0dad2db.png"
                                  alt="Betal med MobilePay"
                                  className="h-7 w-auto object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Description - Only show if exists */}
                      {hasDescription && (
                        <div className="h-8 mb-2">
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {shop.description}
                          </p>
                        </div>
                      )}

                      {/* USP Items - Only show if exists */}
                      {hasUSP && (
                        <div className="h-6 mb-2">
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="line-clamp-1">{shop.usp_items[0]}</span>
                          </div>
                        </div>
                      )}

                      {/* Discount Text - Only show if exists */}
                      {hasDiscount && (
                        <div className="h-6 mb-2">
                          <div className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded font-medium text-center line-clamp-1">
                            {shop.discount_text}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Section - Always at bottom */}
                    <div className={`${viewMode==='list' ? 'min-w-[180px] flex flex-col justify-end' : ''}`}>
                      <motion.a
                        href={shop.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={()=> handleWebshopClick(shop)}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm mb-2"
                      >
                        Besøg webshop
                        <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
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
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* No results message */}
        {filteredShops.length===0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ingen webshops i {categoryName}
            </h3>
            <p className="text-gray-600 mb-4">
              {sortBy === 'popular' ? 
                `Der er endnu ikke tilføjet nogen webshops i kategorien "${categoryName}".` :
                `Ingen webshops i "${categoryName}" matcher de valgte filtre.`
              }
            </p>
            {sortBy !== 'popular' && (
              <button
                onClick={()=> setSortBy('popular')}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Vis alle webshops i kategorien
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default CategoryPage
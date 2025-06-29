import React,{useState,useEffect} from 'react'
import {useSearchParams,Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../common/SafeIcon'
import SEOHead from './SEOHead'
import Breadcrumbs from './Breadcrumbs'
import supabase from '../lib/supabase'

const {FiSearch,FiFilter,FiExternalLink,FiCheck,FiGrid,FiList}=FiIcons

const SearchPage=()=> {
  const [searchParams]=useSearchParams()
  const query=searchParams.get('q') || ''
  const [searchInput,setSearchInput]=useState(query)
  const [viewMode,setViewMode]=useState('grid')
  const [filterType,setFilterType]=useState('all')
  const [results,setResults]=useState({
    webshops: [],
    categories: [],
    blogPosts: []
  })
  const [loading,setLoading]=useState(true)

  useEffect(()=> {
    if (query) {
      performSearch(query)
    } else {
      setLoading(false)
    }
  },[query])

  const performSearch=async (searchTerm)=> {
    setLoading(true)
    
    try {
      const lowerQuery=searchTerm.toLowerCase()

      // Search webshops - REAL DATA ONLY
      const {data: webshopData}=await supabase
        .from('webshops_dk847392')
        .select('*')
        .eq('status','active')
        .or(`name.ilike.%${lowerQuery}%,description.ilike.%${lowerQuery}%`)

      // Search categories - REAL DATA ONLY  
      const {data: categoryData}=await supabase
        .from('categories_dk847392')
        .select('*')
        .eq('status','active')
        .ilike('name',`%${lowerQuery}%`)

      // Search blog posts - REAL DATA ONLY
      const {data: blogData}=await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .eq('status','published')
        .or(`title.ilike.%${lowerQuery}%,excerpt.ilike.%${lowerQuery}%,content.ilike.%${lowerQuery}%`)

      setResults({
        webshops: webshopData || [],
        categories: categoryData || [],
        blogPosts: blogData || []
      })
    } catch (error) {
      console.error('Error performing search:',error)
      setResults({webshops: [],categories: [],blogPosts: []})
    } finally {
      setLoading(false)
    }
  }

  const handleSearch=(e)=> {
    e.preventDefault()
    if (searchInput.trim()) {
      window.history.pushState(null,'',`/search?q=${encodeURIComponent(searchInput.trim())}`)
      performSearch(searchInput.trim())
    }
  }

  const getFilteredResults=()=> {
    switch (filterType) {
      case 'webshops':
        return {webshops: results.webshops,categories: [],blogPosts: []}
      case 'categories':
        return {webshops: [],categories: results.categories,blogPosts: []}
      case 'blog':
        return {webshops: [],categories: [],blogPosts: results.blogPosts}
      default:
        return results
    }
  }

  const filteredResults=getFilteredResults()
  const totalResults=results.webshops.length + results.categories.length + results.blogPosts.length

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`Søgeresultater for "${query}" | Webshop oversigt`}
        description={`Find webshops,kategorier og artikler relateret til "${query}". Søg i Danmarks største webshop directory.`}
        keywords={`${query},danske webshops,søg,online shopping`}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{opacity: 0,y: 20}}
            animate={{opacity: 1,y: 0}}
            transition={{duration: 0.6}}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Søgeresultater
            </h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex bg-gray-50 rounded-lg p-3 max-w-2xl">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e)=> setSearchInput(e.target.value)}
                  placeholder="Søg efter webshops"
                  className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-500 bg-transparent outline-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <SafeIcon icon={FiSearch} className="w-4 h-4" />
                  Søg
                </motion.button>
              </div>
            </form>

            {query && (
              <div className="text-gray-600">
                {loading ? (
                  <p>Søger efter "{query}"...</p>
                ) : (
                  <p>{totalResults} resultater fundet for "{query}"</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e)=> setFilterType(e.target.value)}
              className="bg-white px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle resultater</option>
              <option value="webshops">Kun webshops ({results.webshops.length})</option>
              <option value="categories">Kun kategorier ({results.categories.length})</option>
              <option value="blog">Kun blog artikler ({results.blogPosts.length})</option>
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : totalResults===0 && query ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ingen resultater fundet</h3>
            <p className="text-gray-600 mb-4">Prøv at søge med andre ord eller tjek stavningen.</p>
            <div className="text-sm text-gray-500">
              <p>Forslag:</p>
              <ul className="mt-2 space-y-1">
                <li>• Brug mere generelle søgeord</li>
                <li>• Tjek stavningen</li>
                <li>• Prøv synonymer eller relaterede ord</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Webshops Results */}
            {filteredResults.webshops.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Webshops ({filteredResults.webshops.length})
                </h2>
                <div className={`grid gap-6 ${viewMode==='grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredResults.webshops.map((shop,index)=> (
                    <motion.div
                      key={shop.id}
                      initial={{opacity: 0,y: 20}}
                      animate={{opacity: 1,y: 0}}
                      transition={{duration: 0.6,delay: index * 0.1}}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
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
                              <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                              <div className="text-sm text-blue-600 font-medium">
                                {shop.categories && shop.categories[0] || 'Diverse'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {shop.description && (
                          <p className="text-gray-600 mb-4 text-sm">{shop.description}</p>
                        )}

                        {shop.usp_items && shop.usp_items.length > 0 && shop.usp_items[0] && (
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <SafeIcon icon={FiCheck} className="w-4 h-4 text-gray-600" />
                              {shop.usp_items[0]}
                            </div>
                          </div>
                        )}

                        {shop.discount_text && (
                          <div className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-lg mb-4 font-medium">
                            {shop.discount_text}
                          </div>
                        )}

                        <motion.a
                          href={shop.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{scale: 1.02}}
                          whileTap={{scale: 0.98}}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                          Besøg webshop
                          <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Results */}
            {filteredResults.categories.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Kategorier ({filteredResults.categories.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.categories.map((category,index)=> (
                    <motion.div
                      key={category.id}
                      initial={{opacity: 0,y: 20}}
                      animate={{opacity: 1,y: 0}}
                      transition={{duration: 0.6,delay: index * 0.1}}
                    >
                      <Link to={`/kategori/${category.slug}`}>
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                          {category.description && (
                            <p className="text-gray-600 text-sm">{category.description}</p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Posts Results */}
            {filteredResults.blogPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Blog artikler ({filteredResults.blogPosts.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.blogPosts.map((post,index)=> (
                    <motion.div
                      key={post.id}
                      initial={{opacity: 0,y: 20}}
                      animate={{opacity: 1,y: 0}}
                      transition={{duration: 0.6,delay: index * 0.1}}
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-500">{post.read_time}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SEOHead from './SEOHead';
import Breadcrumbs from './Breadcrumbs';

const { FiSearch, FiFilter, FiExternalLink, FiCheck, FiGrid, FiList } = FiIcons;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [results, setResults] = useState({
    webshops: [],
    categories: [],
    blogPosts: []
  });
  const [loading, setLoading] = useState(true);

  // Mock data for search results
  const allWebshops = [
    {
      id: 1,
      name: 'Wavell',
      category: 'Herremode',
      description: 'Skandinavisk herremode med fokus på kvalitet og bæredygtighed',
      logo: 'https://wavell.dk/cdn/shop/files/wavell-logo.svg?v=1614264502',
      website: 'https://wavell.dk/',
      trustpilotUrl: 'https://dk.trustpilot.com/review/wavell.dk',
      danishBased: true,
      discount: 'Fri fragt over 500 kr',
      shipping: 'Levering 1-3 hverdage',
      tags: ['herremode', 'tøj', 'skandinavisk', 'bæredygtig']
    },
    {
      id: 2,
      name: 'Proshop',
      category: 'Elektronik',
      description: 'Danmarks største elektronik webshop med over 100.000 produkter',
      logo: 'https://www.proshop.dk/Images/logos/proshop_logo.svg',
      website: 'https://www.proshop.dk/',
      trustpilotUrl: 'https://dk.trustpilot.com/review/proshop.dk',
      danishBased: true,
      discount: 'Dagens tilbud op til 50% rabat',
      shipping: 'Express levering mulig',
      tags: ['elektronik', 'computer', 'gaming', 'mobil']
    },
    {
      id: 3,
      name: 'Babysam',
      category: 'Børn',
      description: 'Alt til baby og børn - fra barnevogne til legetøj',
      logo: 'https://www.babysam.dk/skin/frontend/babysam/default/images/logo.png',
      website: 'https://www.babysam.dk/',
      trustpilotUrl: 'https://dk.trustpilot.com/review/babysam.dk',
      danishBased: true,
      discount: '30 dages returret',
      shipping: 'Fri fragt over 499 kr',
      tags: ['baby', 'børn', 'legetøj', 'barnevogn']
    },
    {
      id: 4,
      name: 'Sinful',
      category: 'Voksen',
      description: 'Nordeuropas største sexlegetøjs webshop',
      logo: 'https://www.sinful.dk/media/logo/websites/1/sinful-logo-black.svg',
      website: 'https://www.sinful.dk/',
      trustpilotUrl: 'https://dk.trustpilot.com/review/sinful.dk',
      danishBased: true,
      discount: 'Diskret levering og emballage',
      shipping: 'Anonymt pakke-ID',
      tags: ['voksen', 'sexlegetøj', 'wellness']
    }
  ];

  const allCategories = [
    { name: 'Herremode', slug: 'herremode', count: '1 webshop' },
    { name: 'Damemode', slug: 'damemode', count: '0 webshops' },
    { name: 'Børn', slug: 'boern', count: '1 webshop' },
    { name: 'Elektronik', slug: 'elektronik', count: '1 webshop' },
    { name: 'Voksen', slug: 'voksen', count: '1 webshop' },
    { name: 'Sport og fritid', slug: 'sport-og-fritid', count: '0 webshops' },
    { name: 'Hjemmet', slug: 'hjemmet', count: '0 webshops' },
    { name: 'Mad og drikke', slug: 'mad-og-drikke', count: '0 webshops' },
    { name: 'Bøger og kultur', slug: 'boeger-og-kultur', count: '0 webshops' }
  ];

  const allBlogPosts = [
    {
      id: 1,
      title: 'Guide: Sådan finder du de bedste webshop tilbud i 2024',
      slug: 'guide-bedste-webshop-tilbud-2024',
      excerpt: 'Lær de bedste tricks til at finde de mest favorable tilbud på danske webshops.',
      category: 'Guides',
      readTime: '5 min'
    },
    {
      id: 2,
      title: '10 danske webshops du skal kende i 2024',
      slug: '10-danske-webshops-2024',
      excerpt: 'Opdag de mest innovative og pålidelige danske webshops.',
      category: 'Anmeldelser',
      readTime: '7 min'
    },
    {
      id: 3,
      title: 'Sikkerhed ved online shopping: Dit komplette tjekliste',
      slug: 'sikkerhed-online-shopping-tjekliste',
      excerpt: 'Beskyt dig selv mod svindel og useriøse webshops.',
      category: 'Sikkerhed',
      readTime: '6 min'
    }
  ];

  useEffect(() => {
    performSearch(query);
  }, [query]);

  const performSearch = (searchTerm) => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const lowerQuery = searchTerm.toLowerCase();

      // Search webshops
      const matchingWebshops = allWebshops.filter(shop => 
        shop.name.toLowerCase().includes(lowerQuery) ||
        shop.description.toLowerCase().includes(lowerQuery) ||
        shop.category.toLowerCase().includes(lowerQuery) ||
        shop.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );

      // Search categories
      const matchingCategories = allCategories.filter(category => 
        category.name.toLowerCase().includes(lowerQuery)
      );

      // Search blog posts
      const matchingBlogPosts = allBlogPosts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.category.toLowerCase().includes(lowerQuery)
      );

      setResults({
        webshops: matchingWebshops,
        categories: matchingCategories,
        blogPosts: matchingBlogPosts
      });
      setLoading(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.history.pushState(null, '', `/search?q=${encodeURIComponent(searchInput.trim())}`);
      performSearch(searchInput.trim());
    }
  };

  const getFilteredResults = () => {
    switch (filterType) {
      case 'webshops':
        return { webshops: results.webshops, categories: [], blogPosts: [] };
      case 'categories':
        return { webshops: [], categories: results.categories, blogPosts: [] };
      case 'blog':
        return { webshops: [], categories: [], blogPosts: results.blogPosts };
      default:
        return results;
    }
  };

  const filteredResults = getFilteredResults();
  const totalResults = results.webshops.length + results.categories.length + results.blogPosts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`Søgeresultater for "${query}" | Webshop oversigt`}
        description={`Find webshops, kategorier og artikler relateret til "${query}". Søg i Danmarks største webshop directory.`}
        keywords={`${query}, danske webshops, søg, online shopping`}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Søg efter webshops"
                  className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-500 bg-transparent outline-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
              onChange={(e) => setFilterType(e.target.value)}
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
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : totalResults === 0 && query ? (
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
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredResults.webshops.map((shop, index) => (
                    <motion.div
                      key={shop.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                              <img
                                src={shop.logo}
                                alt={shop.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                {shop.name.charAt(0)}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{shop.name}</h3>
                              <div className="text-sm text-blue-600 font-medium">{shop.category}</div>
                            </div>
                          </div>
                          {shop.danishBased && (
                            <div className="w-4 h-3 rounded-sm overflow-hidden" title="Dansk webshop">
                              <svg viewBox="0 0 37 28" className="w-full h-full">
                                <rect width="37" height="28" fill="#c8102e"/>
                                <rect x="12" y="0" width="4" height="28" fill="white"/>
                                <rect x="0" y="12" width="37" height="4" fill="white"/>
                              </svg>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4 text-sm">{shop.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 text-gray-600" />
                            {shop.shipping}
                          </div>
                        </div>

                        <div className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-lg mb-4 font-medium">
                          {shop.discount}
                        </div>

                        <motion.a
                          href={shop.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
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
                  {filteredResults.categories.map((category, index) => (
                    <motion.div
                      key={category.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link to={`/kategori/${category.slug}`}>
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                          <p className="text-gray-600">{category.count}</p>
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
                  {filteredResults.blogPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link to={`/blog/${post.slug}`}>
                        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                              {post.category}
                            </span>
                            <span className="text-xs text-gray-500">{post.readTime}</span>
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
  );
};

export default SearchPage;
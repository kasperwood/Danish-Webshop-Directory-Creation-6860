import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SEOHead from './SEOHead';
import Breadcrumbs from './Breadcrumbs';
import supabase from '../lib/supabase';

const { FiCalendar, FiUser, FiArrowRight, FiClock, FiStar, FiTrendingUp, FiFilter, FiSearch, FiEye } = FiIcons;

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('kategori') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBlogPosts();
    fetchCategories();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_dk847392')
        .select('category')
        .eq('status', 'published')
        .not('category', 'is', null);

      if (!error && data) {
        const uniqueCategories = [...new Set(data.map(post => post.category))];
        setCategories(uniqueCategories.map(cat => ({ name: cat, count: data.filter(p => p.category === cat).length })));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      setSearchParams({ kategori: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = !selectedCategory || post.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.meta_keywords?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured).slice(0, 1);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead 
          title="Blog | Webshop Oversigt - Loading..."
          description="Loading blog posts..."
        />
        <Breadcrumbs />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Shopping Guides & Webshop Anmeldelser | Danmarks Bedste Online Shopping Tips"
        description="Læs ekspertguides til online shopping, dybdegående webshop anmeldelser og få insider-tips til at finde de bedste tilbud på danske webshops."
        keywords="shopping guides, webshop anmeldelser, online shopping tips, danske webshops, e-handel guide, trustpilot anmeldelser"
      />

      <Breadcrumbs />

      {/* Blog Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png" 
                alt="Webshop oversigt" 
                className="h-20 w-auto" 
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shopping Guides & Webshop Anmeldelser
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Danmarks mest omfattende samling af ekspertguides til online shopping. 
              Find de bedste danske webshops, lær sikkerhedstips og spar penge med vores insider-viden.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Søg i guides
                </label>
                <div className="relative">
                  <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Søg efter guides..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SafeIcon icon={FiFilter} className="w-4 h-4" />
                  Kategorier
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                        !selectedCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>Alle</span>
                      <span className="text-sm text-gray-400">({blogPosts.length})</span>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button
                        onClick={() => handleCategoryChange(category.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                          selectedCategory === category.name ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-sm text-gray-400">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Få de bedste shopping tips
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Tilmeld dig vores nyhedsbrev og få ugentlige ekspert-tips til online shopping
                </p>
                <input
                  type="email"
                  placeholder="Din email"
                  className="w-full px-3 py-2 text-sm border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Tilmeld gratis
                </button>
                <p className="text-xs text-blue-600 mt-2 text-center">
                  Ingen spam. Afmeld når som helst.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ingen blog artikler fundet
                </h3>
                <p className="text-gray-600 mb-4">
                  Der er endnu ikke oprettet nogen blog artikler. 
                </p>
                <Link 
                  to="/admin" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gå til Admin Panel
                  <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPosts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                  >
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="relative">
                        {featuredPosts[0].featured_image && (
                          <img
                            src={featuredPosts[0].featured_image}
                            alt={featuredPosts[0].title}
                            className="w-full h-80 object-cover"
                          />
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                            <SafeIcon icon={FiStar} className="w-3 h-3" />
                            Fremhævet Guide
                          </span>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {featuredPosts[0].category}
                          </span>
                        </div>
                        {featuredPosts[0].view_count && (
                          <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                            <SafeIcon icon={FiEye} className="w-4 h-4" />
                            {featuredPosts[0].view_count.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <SafeIcon icon={FiUser} className="w-4 h-4" />
                            {featuredPosts[0].author || 'Admin'}
                          </div>
                          <div className="flex items-center gap-1">
                            <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                            {new Date(featuredPosts[0].created_at).toLocaleDateString('da-DK')}
                          </div>
                          <div className="flex items-center gap-1">
                            <SafeIcon icon={FiClock} className="w-4 h-4" />
                            {featuredPosts[0].read_time || '5 min'}
                          </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          {featuredPosts[0].title}
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                          {featuredPosts[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex gap-2 flex-wrap">
                            {featuredPosts[0].tags && featuredPosts[0].tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <Link
                            to={`/blog/${featuredPosts[0].slug}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            Læs komplet guide
                            <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Regular Posts Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {regularPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <SafeIcon icon={FiClock} className="w-3 h-3" />
                            {post.read_time || '5 min'}
                          </div>
                          {post.view_count && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <SafeIcon icon={FiEye} className="w-3 h-3" />
                              {post.view_count}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <SafeIcon icon={FiUser} className="w-3 h-3" />
                            {post.author || 'Admin'}
                          </div>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            Læs guide
                            <SafeIcon icon={FiArrowRight} className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* No results for search/filter */}
                {filteredPosts.length === 0 && (selectedCategory || searchQuery) && (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      <p>Ingen guides fundet for den valgte kategori eller søgning.</p>
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setSearchQuery('');
                          setSearchParams({});
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-700 underline"
                      >
                        Vis alle guides
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
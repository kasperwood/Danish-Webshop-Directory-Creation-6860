import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiCalendar, FiUser, FiArrowRight, FiClock, FiTrendingUp, FiStar, FiEye } = FiIcons;

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        setBlogPosts(data);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if no published posts
  if (blogPosts.length === 0) {
    return null;
  }

  const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 2);
  const regularPosts = blogPosts.filter(post => !post.featured).slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ekspert Shopping Guides & Webshop Anmeldelser
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Få insider-tips til online shopping, læs vores dybdegående webshop anmeldelser og find de bedste tilbud på danske webshops
          </p>
        </motion.div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <SafeIcon icon={FiStar} className="w-5 h-5 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900">Fremhævede Artikler</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <SafeIcon icon={FiStar} className="w-3 h-3" />
                        Fremhævet
                      </span>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                    {post.view_count && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                        <SafeIcon icon={FiEye} className="w-3 h-3" />
                        {post.view_count.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        {post.author || 'Admin'}
                      </div>
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString('da-DK')}
                      </div>
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiClock} className="w-4 h-4" />
                        {post.read_time || '5 min'}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {post.tags && post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
                      >
                        Læs guide
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  {post.view_count && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <SafeIcon icon={FiEye} className="w-3 h-3" />
                      {post.view_count}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <SafeIcon icon={FiUser} className="w-3 h-3" />
                      {post.author || 'Admin'}
                    </div>
                    <div className="flex items-center gap-1">
                      <SafeIcon icon={FiClock} className="w-3 h-3" />
                      {post.read_time || '5 min'}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleDateString('da-DK')}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                    >
                      Læs mere
                      <SafeIcon icon={FiArrowRight} className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-blue-600 rounded-xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              Få Danmarks Bedste Shopping Tips Direkte i Din Indbakke
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Tilmeld dig vores nyhedsbrev og få eksklusive guides, insider-tips om de bedste tilbud og anmeldelser af nye danske webshops
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Din email adresse"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                Tilmeld Nu
              </button>
            </div>
            <p className="text-xs text-blue-200 mt-3">
              Gratis at tilmelde. Afmeld når som helst. Vi sender aldrig spam.
            </p>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm border"
          >
            Se alle shopping guides
            <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
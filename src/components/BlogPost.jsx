import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SEOHead from './SEOHead';
import Breadcrumbs from './Breadcrumbs';
import supabase from '../lib/supabase';

const { FiCalendar, FiUser, FiClock, FiArrowLeft, FiShare2, FiBookmark, FiStar, FiTrendingUp, FiCheck, FiArrowRight, FiEye, FiExternalLink } = FiIcons;

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [webshops, setWebshops] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchWebshops();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        navigate('/blog');
        return;
      }

      if (data) {
        setPost(data);
        
        // Increment view count
        await supabase
          .from('blog_posts_dk847392')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);

        // Fetch related posts
        fetchRelatedPosts(data.category, data.id);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category, currentPostId) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .eq('category', category)
        .eq('status', 'published')
        .neq('id', currentPostId)
        .limit(3);

      if (!error && data) {
        setRelatedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const fetchWebshops = async () => {
    try {
      const { data, error } = await supabase
        .from('webshops_dk847392')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (!error && data) {
        setWebshops(data);
      }
    } catch (error) {
      console.error('Error fetching webshops:', error);
    }
  };

  const renderWebshopCard = (webshopId) => {
    const webshop = webshops.find(w => w.id === webshopId);
    if (!webshop) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2">
            <img 
              src={webshop.logo_url} 
              alt={webshop.name} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-sm">
              {webshop.name.charAt(0)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900">{webshop.name}</h4>
            <p className="text-sm text-blue-700">{webshop.categories?.[0] || 'Webshop'}</p>
          </div>
        </div>
        <p className="text-sm text-blue-800 mb-3">{webshop.description}</p>
        {webshop.discount_text && (
          <div className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-lg mb-3 font-medium">
            {webshop.discount_text}
          </div>
        )}
        <div className="flex gap-2">
          <a
            href={webshop.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Besøg {webshop.name}
            <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
          </a>
          {webshop.trustpilot_url && (
            <a
              href={webshop.trustpilot_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Se anmeldelser
            </a>
          )}
        </div>
      </div>
    );
  };

  const processContent = (content) => {
    if (!content) return '';
    
    // Replace webshop shortcodes with actual webshop cards
    return content.replace(/\[webshop:(\d+)\]/g, (match, webshopId) => {
      const webshop = webshops.find(w => w.id === parseInt(webshopId));
      if (!webshop) return '';
      
      return `<div class="webshop-embed" data-webshop-id="${webshopId}"></div>`;
    });
  };

  useEffect(() => {
    if (post && webshops.length > 0) {
      // Replace webshop embeds after content is processed
      const webshopEmbeds = document.querySelectorAll('.webshop-embed');
      webshopEmbeds.forEach(embed => {
        const webshopId = embed.getAttribute('data-webshop-id');
        const webshopCard = renderWebshopCard(parseInt(webshopId));
        if (webshopCard) {
          // Convert React element to HTML string (simplified)
          embed.outerHTML = `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-lg bg-white flex items-center justify-center p-2">
                  <img src="${webshops.find(w => w.id === parseInt(webshopId))?.logo_url}" alt="${webshops.find(w => w.id === parseInt(webshopId))?.name}" class="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h4 class="font-semibold text-blue-900">${webshops.find(w => w.id === parseInt(webshopId))?.name}</h4>
                  <p class="text-sm text-blue-700">${webshops.find(w => w.id === parseInt(webshopId))?.categories?.[0] || 'Webshop'}</p>
                </div>
              </div>
              <p class="text-sm text-blue-800 mb-3">${webshops.find(w => w.id === parseInt(webshopId))?.description}</p>
              ${webshops.find(w => w.id === parseInt(webshopId))?.discount_text ? `<div class="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-lg mb-3 font-medium">${webshops.find(w => w.id === parseInt(webshopId))?.discount_text}</div>` : ''}
              <div class="flex gap-2">
                <a href="${webshops.find(w => w.id === parseInt(webshopId))?.website_url}" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Besøg ${webshops.find(w => w.id === parseInt(webshopId))?.name}
                </a>
              </div>
            </div>
          `;
        }
      });
    }
  }, [post, webshops]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Breadcrumbs />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artikel ikke fundet</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            Gå tilbage til blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={post.seo_title || `${post.title} | Webshop Oversigt Blog`}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords || (post.tags ? post.tags.join(', ') : '')}
        image={post.featured_image}
      />

      <Breadcrumbs />

      {/* Hero Section */}
      <div className="relative bg-white">
        {post.featured_image && (
          <>
            <div className="absolute inset-0">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
            </div>
          </>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
              Tilbage til alle guides
            </Link>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.featured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <SafeIcon icon={FiStar} className="w-3 h-3" />
                  Fremhævet
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-gray-600 mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiUser} className="w-4 h-4" />
                <span>{post.author || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString('da-DK')}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span>{post.read_time || '5 min'}</span>
              </div>
              {post.view_count && (
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiEye} className="w-4 h-4" />
                  <span>{post.view_count.toLocaleString()} visninger</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigator.share && navigator.share({
                  title: post.title,
                  text: post.excerpt,
                  url: window.location.href
                })}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <SafeIcon icon={FiShare2} className="w-4 h-4" />
                Del guide
              </button>
              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <SafeIcon icon={FiBookmark} className="w-4 h-4" />
                Gem
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-8"
            >
              {post.excerpt && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                  <p className="text-blue-800 font-medium">{post.excerpt}</p>
                </div>
              )}
              
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: processContent(post.content) }} 
              />
            </motion.article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Info */}
              {post.author && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Om forfatteren</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {post.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{post.author}</div>
                      <div className="text-sm text-gray-500">Content Writer</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Få flere shopping tips
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Tilmeld dig vores nyhedsbrev og få ugentlige ekspert-guides til online shopping
                </p>
                <input
                  type="email"
                  placeholder="Din email"
                  className="w-full px-3 py-2 text-sm border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Tilmeld gratis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Relaterede artikler</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {relatedPost.featured_image && (
                    <img
                      src={relatedPost.featured_image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                        {relatedPost.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <SafeIcon icon={FiClock} className="w-3 h-3" />
                        {relatedPost.read_time || '5 min'}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      Læs artikel
                      <SafeIcon icon={FiArrowRight} className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
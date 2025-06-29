import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCalendar, FiUser, FiArrowRight, FiClock } = FiIcons;

const BlogSection = () => {
  const featuredPosts = [
    {
      id: 1,
      title: 'Guide: Sådan finder du de bedste webshop tilbud i 2024',
      slug: 'guide-bedste-webshop-tilbud-2024',
      excerpt: 'Lær de bedste tricks til at finde de mest favorable tilbud på danske webshops.',
      author: 'Sarah Nielsen',
      publishedAt: '2024-01-15',
      readTime: '5 min',
      category: 'Guides',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop',
      tags: ['shopping', 'tilbud', 'besparelser']
    },
    {
      id: 2,
      title: '10 danske webshops du skal kende i 2024',
      slug: '10-danske-webshops-2024',
      excerpt: 'Opdag de mest innovative og pålidelige danske webshops.',
      author: 'Michael Hansen',
      publishedAt: '2024-01-12',
      readTime: '7 min',
      category: 'Anmeldelser',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=300&fit=crop',
      tags: ['webshops', 'anmeldelser', 'dansk e-handel']
    },
    {
      id: 3,
      title: 'Sikkerhed ved online shopping: Dit komplette tjekliste',
      slug: 'sikkerhed-online-shopping-tjekliste',
      excerpt: 'Beskyt dig selv mod svindel og useriøse webshops.',
      author: 'Linda Sørensen',
      publishedAt: '2024-01-10',
      readTime: '6 min',
      category: 'Sikkerhed',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=300&fit=crop',
      tags: ['sikkerhed', 'online shopping', 'forbrugertips']
    }
  ];

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
            Seneste fra bloggen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Shopping tips, webshop anmeldelser og guides til bedre online shopping
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString('da-DK')}
                  </div>
                  <div className="flex items-center gap-1">
                    <SafeIcon icon={FiClock} className="w-4 h-4" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
                  >
                    Læs mere
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Se alle artikler
            <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
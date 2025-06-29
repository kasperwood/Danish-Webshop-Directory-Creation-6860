import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiUsers, FiHeart, FiActivity, FiHome, FiMonitor, FiEye, FiShoppingBag, FiMapPin } = FiIcons;

const Categories = () => {
  const categories = [
    {
      name: 'Herremode',
      slug: 'herremode',
      icon: FiUser,
      description: 'Webshops med herretøj og tilbehør',
      color: 'from-blue-500 to-blue-600',
      count: '1 webshop'
    },
    {
      name: 'Damemode',
      slug: 'damemode',
      icon: FiHeart,
      description: 'Mode og styling webshops til kvinder',
      color: 'from-pink-500 to-rose-600',
      count: '0 webshops'
    },
    {
      name: 'Børn',
      slug: 'boern',
      icon: FiUsers,
      description: 'Webshops med alt til de små',
      color: 'from-green-500 to-emerald-600',
      count: '1 webshop'
    },
    {
      name: 'Sport og fritid',
      slug: 'sport-og-fritid',
      icon: FiActivity,
      description: 'Sports- og fritidswebshops',
      color: 'from-orange-500 to-red-600',
      count: '0 webshops'
    },
    {
      name: 'Hjemmet',
      slug: 'hjemmet',
      icon: FiHome,
      description: 'Indretnings- og husholdningswebshops',
      color: 'from-purple-500 to-indigo-600',
      count: '0 webshops'
    },
    {
      name: 'Elektronik',
      slug: 'elektronik',
      icon: FiMonitor,
      description: 'Tech og elektronik webshops',
      color: 'from-gray-600 to-gray-800',
      count: '1 webshop'
    },
    {
      name: 'Voksen',
      slug: 'voksen',
      icon: FiEye,
      description: 'Voksen underholdning og wellness',
      color: 'from-red-500 to-pink-600',
      count: '1 webshop'
    },
    {
      name: 'Mad og drikke',
      slug: 'mad-og-drikke',
      icon: FiShoppingBag,
      description: 'Gourmet mad og specialiteter',
      color: 'from-yellow-500 to-orange-500',
      count: '0 webshops'
    },
    {
      name: 'Rejser og oplevelser',
      slug: 'rejser-og-oplevelser',
      icon: FiMapPin,
      description: 'Rejser, oplevelser og aktiviteter',
      color: 'from-indigo-500 to-purple-600',
      count: '0 webshops'
    }
  ];

  const handleCategoryClick = () => {
    // Smooth scroll to top when clicking category
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop efter kategori
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find de bedste webshops inden for hver kategori
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/kategori/${category.slug}`} onClick={handleCategoryClick}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-br ${category.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <SafeIcon icon={category.icon} className="w-8 h-8" />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-white/80">{category.description}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
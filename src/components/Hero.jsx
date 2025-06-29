import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch } = FiIcons;

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category) => {
    // Scroll to top when navigating to category
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/kategori/${category}`);
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find de bedste{' '}
              <span className="block text-yellow-300">danske webshops</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-3xl mx-auto">
              Vi har samlet et udvalg af pålidelige webshops, hvor du kan shoppe med ro i maven
            </p>

            {/* Search Field */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex bg-white rounded-full p-3 shadow-xl max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søg efter webshops"
                  className="flex-1 px-6 py-3 text-gray-900 placeholder-gray-500 bg-transparent outline-none text-lg"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <SafeIcon icon={FiSearch} className="w-5 h-5" />
                  Søg
                </motion.button>
              </div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-blue-100"
            >
              <p className="text-lg">
                Populære kategorier:{' '}
                <span className="mx-2">•</span>
                <button
                  onClick={() => handleCategoryClick('damemode')}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Mode
                </button>
                <span className="mx-2">•</span>
                <button
                  onClick={() => handleCategoryClick('elektronik')}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Elektronik
                </button>
                <span className="mx-2">•</span>
                <button
                  onClick={() => handleCategoryClick('hjemmet')}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Hjemmet
                </button>
                <span className="mx-2">•</span>
                <button
                  onClick={() => handleCategoryClick('sport-og-fritid')}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Sport
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiSearch, FiMenu, FiX } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    logo_url: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png', // Use main logo
    site_name: 'Webshop oversigt'
  });
  const navigate = useNavigate();

  // Default categories as fallback
  const defaultCategories = [
    { name: 'Herremode', slug: 'herremode', type: 'category' },
    { name: 'Damemode', slug: 'damemode', type: 'category' },
    { name: 'Børn', slug: 'boern', type: 'category' },
    { name: 'Sport og fritid', slug: 'sport-og-fritid', type: 'category' },
    { name: 'Hjemmet', slug: 'hjemmet', type: 'category' },
    { name: 'Elektronik', slug: 'elektronik', type: 'category' },
    { name: 'Voksen', slug: 'voksen', type: 'category' },
    { name: 'Blog', slug: 'blog', type: 'page' }
  ];

  useEffect(() => {
    fetchMenuItems();
    fetchSiteSettings();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items_dk847392')
        .select('*')
        .eq('location', 'header')
        .eq('status', 'active')
        .order('sort_order');

      if (!error && data && data.length > 0) {
        setMenuItems(data);
      } else {
        // Use default categories if no menu items found
        setMenuItems(defaultCategories);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems(defaultCategories);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings_dk847392')
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        setSiteSettings(data[0]);
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearchInput(false);
    }
  };

  const toggleSearch = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery('');
    }
  };

  const getMenuItemLink = (item) => {
    if (item.type === 'category') {
      return `/kategori/${item.slug}`;
    } else if (item.type === 'page') {
      return `/${item.slug}`;
    } else if (item.url) {
      return item.url;
    }
    return '#';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Much Larger */}
          <Link to="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="flex items-center"
            >
              <img 
                src={siteSettings.logo_url} 
                alt={siteSettings.site_name} 
                className="h-16 w-auto sm:h-18 md:h-20 lg:h-24"
                style={{ maxHeight: '96px' }}
                onError={(e) => {
                  e.target.src = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png'
                }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.slice(0, 7).map((item) => (
              <Link
                key={item.slug || item.id}
                to={getMenuItemLink(item)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
              >
                {item.name || item.label}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:flex items-center">
              {showSearchInput ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Søg efter webshops"
                    className="w-48 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="ml-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <SafeIcon icon={FiSearch} className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="ml-1 p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleSearch}
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <SafeIcon icon={FiSearch} className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Mobile search button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <SafeIcon icon={FiSearch} className="w-5 h-5" />
            </motion.button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Søg efter webshops"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiSearch} className="w-4 h-4" />
                </button>
              </form>
            </div>
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.slug || item.id}
                  to={getMenuItemLink(item)}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name || item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
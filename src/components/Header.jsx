import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiSearch, FiMenu, FiX, FiChevronDown } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    logo_url: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png',
    site_name: 'Webshop oversigt'
  });
  const navigate = useNavigate();

  // Compact menu structure with Mode dropdown
  const mainMenuItems = [
    {
      name: 'Mode',
      type: 'dropdown',
      items: [
        { name: 'Herremode', slug: 'herremode', type: 'category' },
        { name: 'Damemode', slug: 'damemode', type: 'category' },
        { name: 'Børn', slug: 'boern', type: 'category' }
      ]
    },
    { name: 'Sport og fritid', slug: 'sport-og-fritid', type: 'category' },
    { name: 'Hjemmet', slug: 'hjemmet', type: 'category' },
    { name: 'Elektronik', slug: 'elektronik', type: 'category' },
    { name: 'Voksen', slug: 'voksen', type: 'category' },
    { name: 'Mad og drikke', slug: 'mad-og-drikke', type: 'category' },
    { name: 'Rejser og oplevelser', slug: 'rejser-og-oplevelser', type: 'category' }
  ];

  useEffect(() => {
    fetchSiteSettings();
  }, []);

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

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    setIsModeDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="flex items-center"
            >
              <img 
                src={siteSettings.logo_url} 
                alt={siteSettings.site_name}
                className="h-12 w-auto sm:h-14 md:h-16 lg:h-18"
                style={{ maxHeight: '72px' }}
                onError={(e) => {
                  e.target.src = 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png';
                }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {mainMenuItems.map((item) => (
              item.type === 'dropdown' ? (
                <div 
                  key={item.name} 
                  className="relative"
                  onMouseEnter={() => setIsModeDropdownOpen(true)}
                  onMouseLeave={() => setIsModeDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm">
                    {item.name}
                    <SafeIcon icon={FiChevronDown} className="w-4 h-4" />
                  </button>
                  
                  <AnimatePresence>
                    {isModeDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                      >
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.slug}
                            to={getMenuItemLink(subItem)}
                            className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                            onClick={handleMenuItemClick}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.slug || item.name}
                  to={getMenuItemLink(item)}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
                >
                  {item.name}
                </Link>
              )
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
        <AnimatePresence>
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
                {mainMenuItems.map((item) => (
                  item.type === 'dropdown' ? (
                    <div key={item.name}>
                      <div className="text-gray-900 font-medium py-2">{item.name}</div>
                      <div className="pl-4 space-y-2">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.slug}
                            to={getMenuItemLink(subItem)}
                            className="block text-gray-700 hover:text-blue-600 transition-colors duration-200 py-1"
                            onClick={handleMenuItemClick}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.slug || item.name}
                      to={getMenuItemLink(item)}
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                      onClick={handleMenuItemClick}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
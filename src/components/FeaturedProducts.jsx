import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiShoppingCart, FiHeart } = FiIcons;

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Herreskjorte',
      price: '599 kr',
      originalPrice: '799 kr',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      category: 'Herremode',
      discount: '25%'
    },
    {
      id: 2,
      name: 'Elegant Damekjole',
      price: '899 kr',
      originalPrice: '1299 kr',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      category: 'Damemode',
      discount: '31%'
    },
    {
      id: 3,
      name: 'Børne Legetøjssæt',
      price: '299 kr',
      originalPrice: '399 kr',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1558877385-9c2e739d6e38?w=400&h=400&fit=crop',
      category: 'Børn',
      discount: '25%'
    },
    {
      id: 4,
      name: 'Trådløse Hovedtelefoner',
      price: '1299 kr',
      originalPrice: '1599 kr',
      rating: 4.6,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      category: 'Elektronik',
      discount: '19%'
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
            Dagens tilbud
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Udvalgte produkter til fantastiske priser - kun i dag!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                  -{product.discount}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <SafeIcon icon={FiHeart} className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="p-4">
                <div className="text-sm text-blue-600 font-medium mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {product.originalPrice}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiShoppingCart} className="w-4 h-4" />
                  Tilføj til kurv
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
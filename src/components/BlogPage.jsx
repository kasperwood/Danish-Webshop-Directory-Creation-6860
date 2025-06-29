import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SEOHead from './SEOHead';
import Breadcrumbs from './Breadcrumbs';

const { FiCalendar, FiUser, FiArrowRight, FiClock } = FiIcons;

const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Guide: Sådan finder du de bedste webshop tilbud i 2024',
      slug: 'guide-bedste-webshop-tilbud-2024',
      excerpt: 'Lær de bedste tricks til at finde de mest favorable tilbud på danske webshops. Vi deler insider-tips og strategier.',
      content: 'Komplet guide content...',
      author: 'Sarah Nielsen',
      publishedAt: '2024-01-15',
      readTime: '5 min',
      category: 'Guides',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      tags: ['shopping', 'tilbud', 'besparelser']
    },
    {
      id: 2,
      title: '10 danske webshops du skal kende i 2024',
      slug: '10-danske-webshops-2024',
      excerpt: 'Opdag de mest innovative og pålidelige danske webshops, der definerer fremtiden for online shopping.',
      content: 'Article content...',
      author: 'Michael Hansen',
      publishedAt: '2024-01-12',
      readTime: '7 min',
      category: 'Anmeldelser',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
      tags: ['webshops', 'anmeldelser', 'dansk e-handel']
    },
    {
      id: 3,
      title: 'Sikkerhed ved online shopping: Dit komplette tjekliste',
      slug: 'sikkerhed-online-shopping-tjekliste',
      excerpt: 'Beskyt dig selv mod svindel og useriøse webshops med vores omfattende sikkerhedsguide.',
      content: 'Security guide content...',
      author: 'Linda Sørensen',
      publishedAt: '2024-01-10',
      readTime: '6 min',
      category: 'Sikkerhed',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
      tags: ['sikkerhed', 'online shopping', 'forbrugertips']
    },
    {
      id: 4,
      title: 'Trustpilot anmeldelser: Sådan læser du mellem linjerne',
      slug: 'trustpilot-anmeldelser-guide',
      excerpt: 'Lær at identificere ægte anmeldelser og få maksimalt udbytte af Trustpilot når du vælger webshop.',
      content: 'Trustpilot guide content...',
      author: 'Anders Petersen',
      publishedAt: '2024-01-08',
      readTime: '4 min',
      category: 'Guides',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      tags: ['trustpilot', 'anmeldelser', 'webshop valg']
    },
    {
      id: 5,
      title: 'Bæredygtig shopping: Grønne webshops i Danmark',
      slug: 'baeredygtig-shopping-groenne-webshops',
      excerpt: 'Udforsk danske webshops der prioriterer bæredygtighed og miljøbevidste forretningspraksisser.',
      content: 'Sustainability content...',
      author: 'Emma Larsen',
      publishedAt: '2024-01-05',
      readTime: '8 min',
      category: 'Bæredygtighed',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
      tags: ['bæredygtighed', 'grøn shopping', 'miljø']
    },
    {
      id: 6,
      title: 'Black Friday vs. normale tilbud: Hvad er reelt bedst?',
      slug: 'black-friday-vs-normale-tilbud',
      excerpt: 'Vi analyserer om Black Friday tilbud virkelig er bedre, eller om du kan finde lige så gode tilbud året rundt.',
      content: 'Black Friday analysis...',
      author: 'Thomas Nielsen',
      publishedAt: '2024-01-03',
      readTime: '6 min',
      category: 'Analyse',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop',
      tags: ['black friday', 'tilbud', 'prissammenligning']
    }
  ];

  const categories = [
    { name: 'Alle', count: 25, active: true },
    { name: 'Guides', count: 8 },
    { name: 'Anmeldelser', count: 6 },
    { name: 'Sikkerhed', count: 4 },
    { name: 'Bæredygtighed', count: 3 },
    { name: 'Analyse', count: 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Blog - Shopping Tips & Webshop Anmeldelser | Webshop oversigt"
        description="Læs de seneste shopping tips, webshop anmeldelser og guides til at finde de bedste tilbud på danske webshops. Ekspert råd til online shopping."
        keywords="shopping blog, webshop anmeldelser, shopping tips, online shopping guide, danske webshops"
      />

      {/* Breadcrumbs */}
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
            {/* Large Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png"
                alt="Webshop oversigt"
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Shopping tips, webshop anmeldelser og guides til at finde de bedste tilbud online
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Kategorier</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${category.active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-400">({category.count})</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Nyhedsbrev</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Få de seneste shopping tips direkte i din indbakke
                </p>
                <input
                  type="email"
                  placeholder="Din email"
                  className="w-full px-3 py-2 text-sm border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Tilmeld
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Fremhævet
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <SafeIcon icon={FiUser} className="w-4 h-4" />
                      {blogPosts[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      {new Date(blogPosts[0].publishedAt).toLocaleDateString('da-DK')}
                    </div>
                    <div className="flex items-center gap-1">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      {blogPosts[0].readTime}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {blogPosts[0].tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/blog/${blogPosts[0].slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      Læs mere
                      <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts.slice(1).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <SafeIcon icon={FiClock} className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <SafeIcon icon={FiUser} className="w-3 h-3" />
                        {post.author}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        Læs mere
                        <SafeIcon icon={FiArrowRight} className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Indlæs flere artikler
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
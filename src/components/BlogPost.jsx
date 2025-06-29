import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SEOHead from './SEOHead';
import Breadcrumbs from './Breadcrumbs';

const { FiCalendar, FiUser, FiClock, FiArrowLeft, FiShare2, FiBookmark } = FiIcons;

const BlogPost = () => {
  const { slug } = useParams();

  // Mock blog post data - in real app this would come from API
  const post = {
    id: 1,
    title: 'Guide: Sådan finder du de bedste webshop tilbud i 2024',
    slug: 'guide-bedste-webshop-tilbud-2024',
    content: `
      <h2>Introduktion til smart shopping</h2>
      <p>I dagens digitale verden er der mange muligheder for at spare penge på online shopping. Men med så mange webshops og tilbud kan det være svært at navigere og finde de virkelig gode deals.</p>
      
      <h2>1. Brug sammenligningstjenester</h2>
      <p>Den første regel ved smart online shopping er altid at sammenligne priser. Brug tjenester som PriceRunner, Geizhals eller Google Shopping til at få et overblik over priser på tværs af forskellige webshops.</p>
      
      <h2>2. Følg med i sæsonudsalg</h2>
      <p>Mange webshops har forudsigelige salgsmønstre. Vinterjakker er billigst om foråret, badetøj er billigst om efteråret. Planlæg dine køb efter sæsonerne.</p>
      
      <h2>3. Tilmeld dig nyhedsbreve</h2>
      <p>De fleste webshops sender eksklusive tilbud til deres nyhedsbrev-abonnenter. Det kan være værd at tilmelde sig, selvom du skal passe på ikke at blive lokket til impulskøb.</p>
      
      <h2>4. Brug cashback-tjenester</h2>
      <p>Tjenester som TopCashback eller iGraal giver dig penge tilbage på dine køb hos udvalgte webshops. Det er penge, du alligevel ville have brugt.</p>
      
      <h2>5. Check Trustpilot anmeldelser</h2>
      <p>Før du handler hos en ny webshop, tjek altid deres Trustpilot-score. En høj score sikrer dig mod dårlig service og kvalitet.</p>
      
      <h2>Konklusion</h2>
      <p>Smart shopping handler om at være patient, forberedt og bruge de rigtige værktøjer. Med disse tips kan du spare betydelige beløb på dine online køb.</p>
    `,
    author: 'Sarah Nielsen',
    publishedAt: '2024-01-15',
    readTime: '5 min',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
    tags: ['shopping', 'tilbud', 'besparelser'],
    excerpt: 'Lær de bedste tricks til at finde de mest favorable tilbud på danske webshops. Vi deler insider-tips og strategier.'
  };

  const relatedPosts = [
    {
      id: 2,
      title: '10 danske webshops du skal kende i 2024',
      slug: '10-danske-webshops-2024',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
      readTime: '7 min'
    },
    {
      id: 3,
      title: 'Sikkerhed ved online shopping: Dit komplette tjekliste',
      slug: 'sikkerhed-online-shopping-tjekliste',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop',
      readTime: '6 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`${post.title} | Webshop oversigt Blog`}
        description={post.excerpt}
        keywords={post.tags.join(',')}
        image={post.image}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
        </div>
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
              Tilbage til blog
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiUser} className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('da-DK')}</span>
              </div>
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiClock} className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <SafeIcon icon={FiShare2} className="w-4 h-4" />
                Del artikel
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
              className="bg-white rounded-xl shadow-sm p-8 prose prose-lg max-w-none"
            >
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </motion.article>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Indholdsfortegnelse</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#introduktion" className="text-blue-600 hover:text-blue-700">Introduktion til smart shopping</a></li>
                  <li><a href="#sammenligning" className="text-blue-600 hover:text-blue-700">Brug sammenligningstjenester</a></li>
                  <li><a href="#saeson" className="text-blue-600 hover:text-blue-700">Følg med i sæsonudsalg</a></li>
                  <li><a href="#nyhedsbreve" className="text-blue-600 hover:text-blue-700">Tilmeld dig nyhedsbreve</a></li>
                  <li><a href="#cashback" className="text-blue-600 hover:text-blue-700">Brug cashback-tjenester</a></li>
                  <li><a href="#trustpilot" className="text-blue-600 hover:text-blue-700">Check Trustpilot anmeldelser</a></li>
                </ul>
              </div>

              {/* Author Bio */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Om forfatteren</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">SN</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{post.author}</div>
                    <div className="text-sm text-gray-500">Shopping ekspert</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Sarah har over 5 års erfaring med online shopping og hjælper forbrugere med at finde de bedste tilbud.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Relaterede artikler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={relatedPost.image}
                  alt={relatedPost.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {relatedPost.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      {relatedPost.readTime}
                    </div>
                    <Link
                      to={`/blog/${relatedPost.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Læs mere →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
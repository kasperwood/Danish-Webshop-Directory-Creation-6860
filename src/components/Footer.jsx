import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } = FiIcons;

const Footer = () => {
  const [footerSettings, setFooterSettings] = useState({
    company_description: 'Berlingske Media A/S\nPilestræde 34\nDK-1147 København K',
    contact_email: 'performance@berlingskemedia.dk',
    contact_location: 'København, Danmark',
    copyright_text: '',
    facebook_url: '#',
    instagram_url: '#',
    twitter_url: '#'
  });
  const [footerLinks, setFooterLinks] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    logo_url: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png',
    site_name: 'Webshop oversigt'
  });
  const [categories, setCategories] = useState([]);

  // Updated footer structure with correct categories
  const defaultFooterStructure = {
    categories: [
      { name: 'Herremode', slug: 'herremode' },
      { name: 'Damemode', slug: 'damemode' },
      { name: 'Børn', slug: 'boern' },
      { name: 'Sport og fritid', slug: 'sport-og-fritid' },
      { name: 'Hjemmet', slug: 'hjemmet' },
      { name: 'Elektronik', slug: 'elektronik' },
      { name: 'Voksen', slug: 'voksen' },
      { name: 'Mad og drikke', slug: 'mad-og-drikke' },
      { name: 'Rejser og oplevelser', slug: 'rejser-og-oplevelser' },
    ],
    blog: [
      { name: 'Alle artikler', slug: 'blog' },
      { name: 'Shopping Guides', slug: 'blog?kategori=guides' },
      { name: 'Sikkerhed', slug: 'blog?kategori=sikkerhed' },
    ],
    information: [
      { name: 'Tilføj din webshop', url: '#' },
      { name: 'Bliv Tryghedsmærket', url: 'https://swiy.co/tryghedsmaerket' },
    ],
    legal: [
      { name: 'Cookie-og privatlivspolitik', url: 'https://www.berlingskemedia.dk/cookie-og-privatlivspolitik/' },
      { name: 'Generelle handelsbetingelser', url: 'https://www.berlingskemedia.dk/handelsbetingelser' },
      { name: 'Cookiedeklaration', url: 'https://www.bt.dk/cookiedeklaration' },
      { name: 'Vilkår', url: 'https://www.berlingskemedia.dk/ophavsret-og-vilkaar/' },
    ]
  };

  useEffect(() => {
    fetchFooterSettings();
    fetchFooterLinks();
    fetchSiteSettings();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories_dk847392')
        .select('name, slug')
        .eq('status', 'active')
        .order('sort_order');

      if (!error && data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchFooterSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_settings_dk847392')
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        setFooterSettings({
          ...footerSettings,
          ...data[0],
          company_description: 'Berlingske Media A/S\nPilestræde 34\nDK-1147 København K',
          contact_email: 'performance@berlingskemedia.dk'
        });
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    }
  };

  const fetchFooterLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_links_dk847392')
        .select('*')
        .eq('status', 'active')
        .order('section, sort_order');

      if (!error && data) {
        setFooterLinks(data);
      }
    } catch (error) {
      console.error('Error fetching footer links:', error);
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

  // Group footer links by section
  const groupedLinks = footerLinks.reduce((acc, link) => {
    if (!acc[link.section]) {
      acc[link.section] = [];
    }
    acc[link.section].push(link);
    return acc;
  }, {});

  // Use categories from database or default structure
  const categoriesLinks = categories.length > 0 ? categories : defaultFooterStructure.categories;
  const blogLinks = groupedLinks.blog?.length > 0 ? groupedLinks.blog : defaultFooterStructure.blog;
  const informationLinks = groupedLinks.information?.length > 0 ? groupedLinks.information : defaultFooterStructure.information;
  const legalLinks = groupedLinks.legal?.length > 0 ? groupedLinks.legal : defaultFooterStructure.legal;

  const getLinkUrl = (link) => {
    if (link.url) return link.url;
    if (link.slug) {
      if (link.slug.startsWith('blog')) return `/${link.slug}`;
      return `/kategori/${link.slug}`;
    }
    return '#';
  };

  const isExternalLink = (url) => {
    return url.startsWith('http') || url.startsWith('mailto');
  };

  return (
    <>
      {/* Disclaimer */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            Dette er et kommercielt site udgivet af Berlingske Medias kommercielle afdeling. Berlingske Medias uafhængige redaktioner har intet at gøre med udarbejdelsen af indholdet.
          </p>
        </div>
      </div>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {/* Company Info - Takes full width on mobile, 2 cols on desktop */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <div className="flex items-center">
                  <img
                    src={siteSettings.logo_url}
                    alt={siteSettings.site_name}
                    className="h-12 w-auto brightness-0 invert"
                  />
                </div>
              </Link>
              
              <div className="text-gray-300 mb-6 text-sm lg:text-base leading-relaxed whitespace-pre-line">
                {footerSettings.company_description}
              </div>

              <div className="flex space-x-4">
                {footerSettings.facebook_url && footerSettings.facebook_url !== '#' && (
                  <a
                    href={footerSettings.facebook_url}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-full"
                    aria-label="Facebook"
                  >
                    <SafeIcon icon={FiFacebook} className="w-5 h-5" />
                  </a>
                )}
                {footerSettings.instagram_url && footerSettings.instagram_url !== '#' && (
                  <a
                    href={footerSettings.instagram_url}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-full"
                    aria-label="Instagram"
                  >
                    <SafeIcon icon={FiInstagram} className="w-5 h-5" />
                  </a>
                )}
                {footerSettings.twitter_url && footerSettings.twitter_url !== '#' && (
                  <a
                    href={footerSettings.twitter_url}
                    className="text-gray-400 hover:text-blue-400 transition-colors p-2 hover:bg-gray-800 rounded-full"
                    aria-label="Twitter"
                  >
                    <SafeIcon icon={FiTwitter} className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Categories - Show all categories */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Kategorier</h3>
              <ul className="space-y-2">
                {categoriesLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={getLinkUrl(link)}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm block py-1"
                    >
                      {link.name || link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blog */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Blog</h3>
              <ul className="space-y-2">
                {blogLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={getLinkUrl(link)}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm block py-1"
                    >
                      {link.name || link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information & Contact */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Information</h3>
              <ul className="space-y-2 mb-6">
                {informationLinks.map((link, index) => {
                  const url = getLinkUrl(link);
                  const isExternal = isExternalLink(url);
                  if (isExternal) {
                    return (
                      <li key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-blue-400 transition-colors text-sm block py-1"
                        >
                          {link.name || link.label}
                        </a>
                      </li>
                    );
                  } else {
                    return (
                      <li key={index}>
                        <Link
                          to={url}
                          className="text-gray-300 hover:text-blue-400 transition-colors text-sm block py-1"
                        >
                          {link.name || link.label}
                        </Link>
                      </li>
                    );
                  }
                })}
              </ul>

              {/* Contact Info - Only Email */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a
                    href={`mailto:${footerSettings.contact_email}`}
                    className="text-gray-300 text-sm hover:text-blue-400 transition-colors"
                  >
                    {footerSettings.contact_email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Only Legal Links */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex justify-center">
              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {legalLinks.map((link, index) => {
                  const url = getLinkUrl(link);
                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                    >
                      {link.name || link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';

const { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } = FiIcons;

const Footer = () => {
  const [footerSettings, setFooterSettings] = useState({
    company_description: 'Danmarks største webshop directory med over 1000+ verificerede webshops. Find og sammenlign de bedste danske webshops med pålidelige anmeldelser.',
    contact_email: 'info@webshop-oversigt.dk',
    contact_location: 'København, Danmark',
    copyright_text: '© 2024 Webshop oversigt. Alle rettigheder forbeholdes.',
    facebook_url: '#',
    instagram_url: '#',
    twitter_url: '#'
  });
  const [footerLinks, setFooterLinks] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    logo_url: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png',
    site_name: 'Webshop oversigt'
  });

  // Default footer structure
  const defaultFooterStructure = {
    categories: [
      { name: 'Herremode', slug: 'herremode' },
      { name: 'Damemode', slug: 'damemode' },
      { name: 'Børn', slug: 'boern' },
      { name: 'Sport og fritid', slug: 'sport-og-fritid' },
      { name: 'Hjemmet', slug: 'hjemmet' },
      { name: 'Elektronik', slug: 'elektronik' },
    ],
    blog: [
      { name: 'Alle artikler', slug: 'blog' },
      { name: 'Shopping Guides', slug: 'blog?kategori=guides' },
      { name: 'Webshop Anmeldelser', slug: 'blog?kategori=anmeldelser' },
      { name: 'Sikkerhed', slug: 'blog?kategori=sikkerhed' },
    ],
    information: [
      { name: 'Om Webshop oversigt', url: '#' },
      { name: 'Tilføj din webshop', url: '#' },
      { name: 'Partnere', url: '#' },
      { name: 'Annoncering', url: '#' },
      { name: 'FAQ', url: '#' },
    ],
    legal: [
      { name: 'Privatlivspolitik', url: '#' },
      { name: 'Cookiepolitik', url: '#' },
      { name: 'Handelsbetingelser', url: '#' },
      { name: 'Sitemap', url: '#' },
    ]
  };

  useEffect(() => {
    fetchFooterSettings();
    fetchFooterLinks();
    fetchSiteSettings();
  }, []);

  const fetchFooterSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_settings_dk847392')
        .select('*')
        .limit(1);

      if (!error && data && data.length > 0) {
        setFooterSettings(data[0]);
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

  // Use default structure if no custom links are found
  const categoriesLinks = groupedLinks.categories?.length > 0 ? groupedLinks.categories : defaultFooterStructure.categories;
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

  return (
    <>
      {/* Disclaimer */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            Dette er et kommercielt site udgivet af Berlingske Medias kommercielle afdeling. 
            Berlingske Medias uafhængige redaktioner har intet at gøre med udarbejdelsen af indholdet.
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
              <p className="text-gray-300 mb-6 text-sm lg:text-base leading-relaxed">
                {footerSettings.company_description}
              </p>
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

            {/* Categories */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-white">Kategorier</h3>
              <ul className="space-y-2">
                {categoriesLinks.slice(0, 6).map((link, index) => (
                  <li key={index}>
                    <Link
                      to={getLinkUrl(link)}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm block py-1"
                    >
                      {link.name || link.label}
                    </Link>
                  </li>
                ))}
                {categoriesLinks.length > 6 && (
                  <li className="pt-2">
                    <Link
                      to="/kategorier"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Se alle kategorier →
                    </Link>
                  </li>
                )}
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
                {informationLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={getLinkUrl(link)}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm block py-1"
                    >
                      {link.name || link.label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="space-y-3">
                {footerSettings.contact_email && (
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiMail} className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{footerSettings.contact_email}</span>
                  </div>
                )}
                {footerSettings.contact_location && (
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{footerSettings.contact_location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-8 pt-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <p className="text-gray-400 text-sm text-center lg:text-left">
                {footerSettings.copyright_text}
              </p>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={getLinkUrl(link)}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.name || link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
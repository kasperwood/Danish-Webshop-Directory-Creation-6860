import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiMove, FiEye, FiEyeOff, FiNavigation, FiLayout } = FiIcons

const MenuFooterManager = () => {
  const [activeSection, setActiveSection] = useState('header-menu')
  const [menuItems, setMenuItems] = useState([])
  const [footerSettings, setFooterSettings] = useState({
    company_description: 'Danmarks største webshop directory med over 1000+ verificerede webshops. Find og sammenlign de bedste danske webshops med pålidelige anmeldelser.',
    contact_email: 'info@webshop-oversigt.dk',
    contact_location: 'København, Danmark',
    copyright_text: '© 2024 Webshop oversigt. Alle rettigheder forbeholdes.',
    facebook_url: '',
    instagram_url: '',
    twitter_url: ''
  })
  const [footerLinks, setFooterLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    slug: '',
    type: 'page',
    location: 'header',
    section: '',
    sort_order: 0,
    status: 'active'
  })

  // Default structure to populate if database is empty
  const defaultMenuItems = [
    { label: 'Herremode', slug: 'herremode', type: 'category', location: 'header', sort_order: 1, status: 'active' },
    { label: 'Damemode', slug: 'damemode', type: 'category', location: 'header', sort_order: 2, status: 'active' },
    { label: 'Børn', slug: 'boern', type: 'category', location: 'header', sort_order: 3, status: 'active' },
    { label: 'Sport og fritid', slug: 'sport-og-fritid', type: 'category', location: 'header', sort_order: 4, status: 'active' },
    { label: 'Hjemmet', slug: 'hjemmet', type: 'category', location: 'header', sort_order: 5, status: 'active' },
    { label: 'Elektronik', slug: 'elektronik', type: 'category', location: 'header', sort_order: 6, status: 'active' },
    { label: 'Voksen', slug: 'voksen', type: 'category', location: 'header', sort_order: 7, status: 'active' },
    { label: 'Blog', slug: 'blog', type: 'page', location: 'header', sort_order: 8, status: 'active' }
  ]

  const defaultFooterLinks = [
    // Categories section
    { label: 'Herremode', slug: 'herremode', type: 'category', location: 'footer', section: 'categories', sort_order: 1, status: 'active' },
    { label: 'Damemode', slug: 'damemode', type: 'category', location: 'footer', section: 'categories', sort_order: 2, status: 'active' },
    { label: 'Børn', slug: 'boern', type: 'category', location: 'footer', section: 'categories', sort_order: 3, status: 'active' },
    { label: 'Sport og fritid', slug: 'sport-og-fritid', type: 'category', location: 'footer', section: 'categories', sort_order: 4, status: 'active' },
    { label: 'Hjemmet', slug: 'hjemmet', type: 'category', location: 'footer', section: 'categories', sort_order: 5, status: 'active' },
    { label: 'Elektronik', slug: 'elektronik', type: 'category', location: 'footer', section: 'categories', sort_order: 6, status: 'active' },
    
    // Blog section
    { label: 'Alle artikler', slug: 'blog', type: 'page', location: 'footer', section: 'blog', sort_order: 1, status: 'active' },
    { label: 'Shopping Guides', slug: 'blog?kategori=guides', type: 'page', location: 'footer', section: 'blog', sort_order: 2, status: 'active' },
    { label: 'Webshop Anmeldelser', slug: 'blog?kategori=anmeldelser', type: 'page', location: 'footer', section: 'blog', sort_order: 3, status: 'active' },
    { label: 'Sikkerhed', slug: 'blog?kategori=sikkerhed', type: 'page', location: 'footer', section: 'blog', sort_order: 4, status: 'active' },
    
    // Information section
    { label: 'Om Webshop oversigt', url: '#', type: 'external', location: 'footer', section: 'information', sort_order: 1, status: 'active' },
    { label: 'Tilføj din webshop', url: '#', type: 'external', location: 'footer', section: 'information', sort_order: 2, status: 'active' },
    { label: 'Partnere', url: '#', type: 'external', location: 'footer', section: 'information', sort_order: 3, status: 'active' },
    { label: 'Annoncering', url: '#', type: 'external', location: 'footer', section: 'information', sort_order: 4, status: 'active' },
    { label: 'FAQ', url: '#', type: 'external', location: 'footer', section: 'information', sort_order: 5, status: 'active' },
    
    // Legal section
    { label: 'Privatlivspolitik', url: '#', type: 'external', location: 'footer', section: 'legal', sort_order: 1, status: 'active' },
    { label: 'Cookiepolitik', url: '#', type: 'external', location: 'footer', section: 'legal', sort_order: 2, status: 'active' },
    { label: 'Handelsbetingelser', url: '#', type: 'external', location: 'footer', section: 'legal', sort_order: 3, status: 'active' },
    { label: 'Sitemap', url: '#', type: 'external', location: 'footer', section: 'legal', sort_order: 4, status: 'active' }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch menu items
      const { data: menuData } = await supabase
        .from('menu_items_dk847392')
        .select('*')
        .order('location, sort_order')

      if (menuData && menuData.length > 0) {
        setMenuItems(menuData)
      } else {
        // Populate with default menu items if empty
        await populateDefaultMenuItems()
      }

      // Fetch footer settings
      const { data: footerSettingsData } = await supabase
        .from('footer_settings_dk847392')
        .select('*')
        .limit(1)

      if (footerSettingsData && footerSettingsData.length > 0) {
        setFooterSettings({ ...footerSettings, ...footerSettingsData[0] })
      } else {
        // Create default footer settings
        await createDefaultFooterSettings()
      }

      // Fetch footer links
      const { data: footerLinksData } = await supabase
        .from('footer_links_dk847392')
        .select('*')
        .order('section, sort_order')

      if (footerLinksData && footerLinksData.length > 0) {
        setFooterLinks(footerLinksData)
      } else {
        // Populate with default footer links if empty
        await populateDefaultFooterLinks()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  const populateDefaultMenuItems = async () => {
    try {
      const { error } = await supabase
        .from('menu_items_dk847392')
        .insert(defaultMenuItems)
      
      if (!error) {
        setMenuItems(defaultMenuItems)
      }
    } catch (error) {
      console.error('Error populating default menu items:', error)
    }
  }

  const populateDefaultFooterLinks = async () => {
    try {
      const { error } = await supabase
        .from('footer_links_dk847392')
        .insert(defaultFooterLinks)
      
      if (!error) {
        setFooterLinks(defaultFooterLinks)
      }
    } catch (error) {
      console.error('Error populating default footer links:', error)
    }
  }

  const createDefaultFooterSettings = async () => {
    try {
      const { error } = await supabase
        .from('footer_settings_dk847392')
        .insert([footerSettings])
      
      if (error) {
        console.error('Error creating default footer settings:', error)
      }
    } catch (error) {
      console.error('Error creating default footer settings:', error)
    }
  }

  const saveFooterSettings = async () => {
    try {
      const { error } = await supabase
        .from('footer_settings_dk847392')
        .upsert([{ ...footerSettings, updated_at: new Date().toISOString() }])

      if (!error) {
        alert('Footer indstillinger gemt!')
      } else {
        alert('Fejl ved gemning af footer indstillinger: ' + error.message)
      }
    } catch (error) {
      console.error('Error saving footer settings:', error)
      alert('Fejl ved gemning af footer indstillinger')
    }
  }

  const handleSubmitMenuItem = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const itemData = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      if (editingItem) {
        const { error } = await supabase
          .from('menu_items_dk847392')
          .update(itemData)
          .eq('id', editingItem.id)

        if (!error) {
          await fetchData()
          setShowModal(false)
          setEditingItem(null)
          alert('Menu element opdateret!')
        } else {
          alert('Fejl ved opdatering: ' + error.message)
        }
      } else {
        const { error } = await supabase
          .from('menu_items_dk847392')
          .insert([itemData])

        if (!error) {
          await fetchData()
          setShowModal(false)
          alert('Menu element tilføjet!')
        } else {
          alert('Fejl ved tilføjelse: ' + error.message)
        }
      }
    } catch (error) {
      console.error('Error saving menu item:', error)
      alert('Uventet fejl ved gemning')
    }
    setLoading(false)
    resetForm()
  }

  const handleSubmitFooterLink = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const linkData = {
        ...formData,
        updated_at: new Date().toISOString()
      }

      if (editingItem) {
        const { error } = await supabase
          .from('footer_links_dk847392')
          .update(linkData)
          .eq('id', editingItem.id)

        if (!error) {
          await fetchData()
          setShowModal(false)
          setEditingItem(null)
          alert('Footer link opdateret!')
        } else {
          alert('Fejl ved opdatering: ' + error.message)
        }
      } else {
        const { error } = await supabase
          .from('footer_links_dk847392')
          .insert([linkData])

        if (!error) {
          await fetchData()
          setShowModal(false)
          alert('Footer link tilføjet!')
        } else {
          alert('Fejl ved tilføjelse: ' + error.message)
        }
      }
    } catch (error) {
      console.error('Error saving footer link:', error)
      alert('Uventet fejl ved gemning')
    }
    setLoading(false)
    resetForm()
  }

  const handleEdit = (item, isFooterLink = false) => {
    setEditingItem(item)
    if (isFooterLink) {
      setFormData({
        label: item.label,
        url: item.url || '',
        slug: item.slug || '',
        type: item.type,
        location: 'footer',
        section: item.section,
        sort_order: item.sort_order,
        status: item.status
      })
    } else {
      setFormData({
        label: item.label,
        url: item.url || '',
        slug: item.slug || '',
        type: item.type,
        location: item.location,
        section: '',
        sort_order: item.sort_order,
        status: item.status
      })
    }
    setShowModal(true)
  }

  const handleDelete = async (id, isFooterLink = false) => {
    if (confirm('Er du sikker på at du vil slette dette element?')) {
      try {
        const table = isFooterLink ? 'footer_links_dk847392' : 'menu_items_dk847392'
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id)

        if (!error) {
          await fetchData()
          alert('Element slettet!')
        } else {
          alert('Fejl ved sletning: ' + error.message)
        }
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Uventet fejl ved sletning')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      url: '',
      slug: '',
      type: 'page',
      location: activeSection === 'header-menu' ? 'header' : 'footer',
      section: '',
      sort_order: 0,
      status: 'active'
    })
  }

  const getHeaderMenuItems = () => menuItems.filter(item => item.location === 'header')
  const getFooterLinksBySection = (section) => footerLinks.filter(link => link.section === section)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu & Footer Manager</h2>
          <p className="text-gray-600">Administrer navigations menu og footer indhold</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'header-menu', label: 'Header Menu', icon: FiNavigation },
              { id: 'footer-settings', label: 'Footer Indstillinger', icon: FiLayout },
              { id: 'footer-links', label: 'Footer Links', icon: FiNavigation }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeSection === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Header Menu Section */}
          {activeSection === 'header-menu' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Header Navigation Menu</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData({ ...formData, location: 'header' })
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  Tilføj Menu Element
                </motion.button>
              </div>

              <div className="space-y-3">
                {getHeaderMenuItems().map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SafeIcon icon={FiMove} className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-500">
                          {item.type === 'category' ? `Kategori: ${item.slug}` :
                           item.type === 'page' ? `Side: ${item.slug}` :
                           `Link: ${item.url}`}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Settings Section */}
          {activeSection === 'footer-settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Footer Indstillinger</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveFooterSettings}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <SafeIcon icon={FiSave} className="w-4 h-4" />
                  Gem Indstillinger
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firma beskrivelse
                  </label>
                  <textarea
                    value={footerSettings.company_description}
                    onChange={(e) => setFooterSettings({ ...footerSettings, company_description: e.target.value })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontakt email
                    </label>
                    <input
                      type="email"
                      value={footerSettings.contact_email}
                      onChange={(e) => setFooterSettings({ ...footerSettings, contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontakt lokation
                    </label>
                    <input
                      type="text"
                      value={footerSettings.contact_location}
                      onChange={(e) => setFooterSettings({ ...footerSettings, contact_location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Copyright tekst
                    </label>
                    <input
                      type="text"
                      value={footerSettings.copyright_text}
                      onChange={(e) => setFooterSettings({ ...footerSettings, copyright_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Social Media Links</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={footerSettings.facebook_url}
                        onChange={(e) => setFooterSettings({ ...footerSettings, facebook_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={footerSettings.instagram_url}
                        onChange={(e) => setFooterSettings({ ...footerSettings, instagram_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter URL
                      </label>
                      <input
                        type="url"
                        value={footerSettings.twitter_url}
                        onChange={(e) => setFooterSettings({ ...footerSettings, twitter_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Links Section */}
          {activeSection === 'footer-links' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Footer Links</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData({ ...formData, location: 'footer' })
                    setShowModal(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  Tilføj Footer Link
                </motion.button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {['categories', 'blog', 'information', 'legal'].map((section) => (
                  <div key={section} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 capitalize">
                      {section === 'categories' ? 'Kategorier' :
                       section === 'blog' ? 'Blog' :
                       section === 'information' ? 'Information' :
                       section === 'legal' ? 'Legal' : section}
                    </h4>
                    <div className="space-y-2">
                      {getFooterLinksBySection(section).map((link) => (
                        <div key={link.id} className="flex items-center justify-between bg-white rounded p-2">
                          <div className="text-sm text-gray-700">{link.label}</div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(link, true)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                            >
                              <SafeIcon icon={FiEdit2} className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(link.id, true)}
                              className="p-1 text-red-600 hover:text-red-700"
                            >
                              <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingItem ? 'Rediger' : 'Tilføj'} {formData.location === 'header' ? 'Menu Element' : 'Footer Link'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingItem(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={formData.location === 'header' ? handleSubmitMenuItem : handleSubmitFooterLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="page">Side</option>
                    <option value="category">Kategori</option>
                    <option value="external">Ekstern Link</option>
                  </select>
                </div>

                {formData.type === 'external' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={formData.type === 'category' ? 'herremode' : 'blog'}
                    />
                  </div>
                )}

                {formData.location === 'footer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sektion *
                    </label>
                    <select
                      required
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Vælg sektion</option>
                      <option value="categories">Kategorier</option>
                      <option value="blog">Blog</option>
                      <option value="information">Information</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rækkefølge
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Aktiv</option>
                      <option value="inactive">Inaktiv</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingItem(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuller
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    {loading ? 'Gemmer...' : 'Gem'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MenuFooterManager
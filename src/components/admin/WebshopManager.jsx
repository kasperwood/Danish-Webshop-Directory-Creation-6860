import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiSearch, FiFilter, FiEye, FiMousePointer, FiSave, FiX, FiTag, FiList, FiMove, FiCreditCard, FiRefreshCw } = FiIcons

const WebshopManager = () => {
  const [webshops, setWebshops] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingWebshop, setEditingWebshop] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    trustpilot_url: '',
    categories: [],
    emaerket: false,
    tryghedsmaerket: false,
    mobilepay_accepted: false,
    country: 'denmark',
    discount_text: '',
    featured: false,
    status: 'active',
    sort_order: 0,
    usp_items: [''],
    headline_text: '',
    headline_active: false,
    headline_color: '#ffffff',
    headline_bg_color: '#ff0000',
    headline_speed: 10
  })

  // Updated categories list with "Rejser og oplevelser"
  const defaultCategories = [
    { name: 'Herremode', slug: 'herremode' },
    { name: 'Damemode', slug: 'damemode' },
    { name: 'Børn', slug: 'boern' },
    { name: 'Sport og fritid', slug: 'sport-og-fritid' },
    { name: 'Hjemmet', slug: 'hjemmet' },
    { name: 'Elektronik', slug: 'elektronik' },
    { name: 'Voksen', slug: 'voksen' },
    { name: 'Mad og drikke', slug: 'mad-og-drikke' },
    { name: 'Rejser og oplevelser', slug: 'rejser-og-oplevelser' }
  ]

  useEffect(() => {
    fetchWebshops()
    fetchCategories()
  }, [])

  const fetchWebshops = async () => {
    try {
      const { data, error } = await supabase
        .from('webshops_dk847392')
        .select('*')
        .order('sort_order', { ascending: true })

      if (!error) {
        setWebshops(data || [])
      } else {
        console.error('Error fetching webshops:', error)
      }
    } catch (error) {
      console.error('Error fetching webshops:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories_dk847392')
        .select('name, slug')
        .eq('status', 'active')
        .order('sort_order')

      if (!error && data && data.length > 0) {
        setCategories(data)
      } else {
        // Use default categories if none found in database
        setCategories(defaultCategories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Use default categories on error
      setCategories(defaultCategories)
    }
  }

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[æøå]/g, (match) => {
        const map = { 'æ': 'ae', 'ø': 'oe', 'å': 'aa' }
        return map[match]
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare webshop data - ensure categories is always an array
      const webshopData = {
        name: formData.name,
        slug: generateSlug(formData.name),
        description: formData.description,
        logo_url: formData.logo_url,
        website_url: formData.website_url,
        trustpilot_url: formData.trustpilot_url,
        categories: Array.isArray(formData.categories) ? formData.categories : [],
        emaerket: formData.emaerket,
        tryghedsmaerket: formData.tryghedsmaerket,
        mobilepay_accepted: formData.mobilepay_accepted,
        // Only include country if it exists in schema, otherwise use danish_based
        ...(formData.country && { country: formData.country }),
        // Legacy support - always set danish_based for backward compatibility
        danish_based: formData.country === 'denmark',
        discount_text: formData.discount_text,
        featured: formData.featured,
        status: formData.status,
        sort_order: formData.sort_order,
        usp_items: formData.usp_items.filter(item => item.trim() !== ''),
        headline_text: formData.headline_text,
        headline_active: formData.headline_active,
        headline_color: formData.headline_color,
        headline_bg_color: formData.headline_bg_color,
        headline_speed: formData.headline_speed,
        updated_at: new Date().toISOString()
      }

      console.log('Submitting webshop data:', webshopData)

      if (editingWebshop) {
        // Update existing webshop
        const { error } = await supabase
          .from('webshops_dk847392')
          .update(webshopData)
          .eq('id', editingWebshop.id)

        if (!error) {
          await fetchWebshops()
          setShowModal(false)
          setEditingWebshop(null)
          // Removed browser alert
        } else {
          console.error('Update error:', error)
          // Removed browser alert
        }
      } else {
        // Create new webshop
        const { error } = await supabase
          .from('webshops_dk847392')
          .insert([webshopData])

        if (!error) {
          await fetchWebshops()
          setShowModal(false)
          // Removed browser alert
        } else {
          console.error('Insert error:', error)
          // Removed browser alert
        }
      }
    } catch (error) {
      console.error('Error saving webshop:', error)
      // Removed browser alert
    } finally {
      setLoading(false)
      resetForm()
    }
  }

  const handleEdit = (webshop) => {
    setEditingWebshop(webshop)
    setFormData({
      name: webshop.name,
      description: webshop.description || '',
      logo_url: webshop.logo_url || '',
      website_url: webshop.website_url,
      trustpilot_url: webshop.trustpilot_url || '',
      categories: Array.isArray(webshop.categories) ? webshop.categories : [],
      emaerket: webshop.emaerket,
      tryghedsmaerket: webshop.tryghedsmaerket,
      mobilepay_accepted: webshop.mobilepay_accepted || false,
      // Load country field or derive from legacy danish_based
      country: webshop.country || (webshop.danish_based ? 'denmark' : 'denmark'),
      discount_text: webshop.discount_text || '',
      featured: webshop.featured,
      status: webshop.status,
      sort_order: webshop.sort_order || 0,
      // Load USP items or default
      usp_items: webshop.usp_items && Array.isArray(webshop.usp_items) ? webshop.usp_items : [''],
      // Load headline data
      headline_text: webshop.headline_text || '',
      headline_active: webshop.headline_active || false,
      headline_color: webshop.headline_color || '#ffffff',
      headline_bg_color: webshop.headline_bg_color || '#ff0000',
      headline_speed: webshop.headline_speed || 10
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    // Removed browser confirm dialog
    try {
      const { error } = await supabase
        .from('webshops_dk847392')
        .delete()
        .eq('id', id)

      if (!error) {
        await fetchWebshops()
        // Removed browser alert
      } else {
        // Removed browser alert
      }
    } catch (error) {
      console.error('Error deleting webshop:', error)
      // Removed browser alert
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      website_url: '',
      trustpilot_url: '',
      categories: [],
      emaerket: false,
      tryghedsmaerket: false,
      mobilepay_accepted: false,
      country: 'denmark',
      discount_text: '',
      featured: false,
      status: 'active',
      sort_order: 0,
      usp_items: [''],
      headline_text: '',
      headline_active: false,
      headline_color: '#ffffff',
      headline_bg_color: '#ff0000',
      headline_speed: 10
    })
  }

  // USP Management Functions
  const addUSPItem = () => {
    setFormData({ ...formData, usp_items: [...formData.usp_items, ''] })
  }

  const removeUSPItem = (index) => {
    const newUSPItems = formData.usp_items.filter((_, i) => i !== index)
    setFormData({ ...formData, usp_items: newUSPItems.length > 0 ? newUSPItems : [''] })
  }

  const updateUSPItem = (index, value) => {
    const newUSPItems = [...formData.usp_items]
    newUSPItems[index] = value
    setFormData({ ...formData, usp_items: newUSPItems })
  }

  // Category management functions
  const handleCategoryChange = (categorySlug, isChecked) => {
    let newCategories = [...formData.categories]
    
    if (isChecked) {
      if (!newCategories.includes(categorySlug)) {
        newCategories.push(categorySlug)
      }
    } else {
      newCategories = newCategories.filter(cat => cat !== categorySlug)
    }
    
    setFormData({ ...formData, categories: newCategories })
  }

  // Get country flag component
  const getCountryFlag = (country) => {
    switch (country) {
      case 'denmark':
        return (
          <div className="w-5 h-4 rounded-sm overflow-hidden" title="Dansk webshop">
            <svg viewBox="0 0 37 28" className="w-full h-full">
              <rect width="37" height="28" fill="#c8102e" />
              <rect x="12" y="0" width="4" height="28" fill="white" />
              <rect x="0" y="12" width="37" height="4" fill="white" />
            </svg>
          </div>
        )
      case 'norway':
        return (
          <div className="w-5 h-4 rounded-sm overflow-hidden" title="Norsk webshop">
            <svg viewBox="0 0 37 28" className="w-full h-full">
              <rect width="37" height="28" fill="#ef2b2d" />
              <rect x="12" y="0" width="4" height="28" fill="white" />
              <rect x="0" y="12" width="37" height="4" fill="white" />
              <rect x="12" y="0" width="2" height="28" fill="#002868" />
              <rect x="0" y="13" width="37" height="2" fill="#002868" />
            </svg>
          </div>
        )
      case 'sweden':
        return (
          <div className="w-5 h-4 rounded-sm overflow-hidden" title="Svensk webshop">
            <svg viewBox="0 0 37 28" className="w-full h-full">
              <rect width="37" height="28" fill="#006aa7" />
              <rect x="12" y="0" width="4" height="28" fill="#fecc00" />
              <rect x="0" y="12" width="37" height="4" fill="#fecc00" />
            </svg>
          </div>
        )
      default:
        // Legacy support for danish_based field
        if (country === true || country === 'true') {
          return (
            <div className="w-5 h-4 rounded-sm overflow-hidden" title="Dansk webshop">
              <svg viewBox="0 0 37 28" className="w-full h-full">
                <rect width="37" height="28" fill="#c8102e" />
                <rect x="12" y="0" width="4" height="28" fill="white" />
                <rect x="0" y="12" width="37" height="4" fill="white" />
              </svg>
            </div>
          )
        }
        return null
    }
  }

  const filteredWebshops = webshops.filter(webshop => {
    const matchesSearch = webshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          webshop.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || (webshop.categories && webshop.categories.includes(filterCategory))
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webshops</h2>
          <p className="text-gray-600">Administrer webshops og deres indhold</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Tilføj Webshop
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Søg webshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Alle kategorier</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredWebshops.length} webshops fundet
            </span>
          </div>
        </div>
      </div>

      {/* Webshops List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Rækkefølge</th>
                <th className="text-left p-4 font-semibold text-gray-900">Webshop</th>
                <th className="text-left p-4 font-semibold text-gray-900">Kategorier</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                <th className="text-left p-4 font-semibold text-gray-900">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {filteredWebshops.map((webshop) => (
                <tr key={webshop.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <SafeIcon icon={FiMove} className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{webshop.sort_order || 0}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        {webshop.logo_url ? (
                          <img
                            src={webshop.logo_url}
                            alt={webshop.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {webshop.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          <a
                            href={webshop.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors"
                          >
                            {webshop.name}
                          </a>
                          {getCountryFlag(webshop.country || (webshop.danish_based && 'denmark'))}
                        </div>
                        <div className="text-sm text-gray-500">{webshop.slug}</div>
                        {webshop.headline_active && webshop.headline_text && (
                          <div
                            className="text-xs px-2 py-1 rounded mt-1 font-medium"
                            style={{
                              backgroundColor: webshop.headline_bg_color || '#ff0000',
                              color: webshop.headline_color || '#ffffff'
                            }}
                          >
                            {webshop.headline_text}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {webshop.categories && webshop.categories.length > 0 ? (
                        webshop.categories.map((catSlug) => {
                          const category = categories.find(c => c.slug === catSlug)
                          return (
                            <a
                              key={catSlug}
                              href={`#/kategori/${catSlug}`}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                            >
                              {category?.name || catSlug}
                            </a>
                          )
                        })
                      ) : (
                        <span className="text-gray-400 text-sm">Ingen kategorier</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        webshop.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {webshop.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                      <div className="flex gap-1">
                        {webshop.featured && (
                          <span className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs">
                            Udvalgt
                          </span>
                        )}
                        {(webshop.country === 'denmark' || webshop.danish_based) && (
                          <span className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs">
                            DK
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm space-y-1">
                      {/* Payment and Certification Icons */}
                      <div className="flex gap-1">
                        {webshop.emaerket && (
                          <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">
                            e-mærket
                          </span>
                        )}
                        {webshop.tryghedsmaerket && (
                          <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded text-xs">
                            Tryghed
                          </span>
                        )}
                        {webshop.mobilepay_accepted && (
                          <div className="flex items-center gap-1">
                            <SafeIcon icon={FiCreditCard} className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600">MobilePay</span>
                          </div>
                        )}
                      </div>
                      
                      {/* USPs */}
                      {webshop.usp_items && Array.isArray(webshop.usp_items) && webshop.usp_items.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiList} className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {webshop.usp_items.length} USPs
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiList} className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">Ingen USPs</span>
                        </div>
                      )}
                      
                      {/* Headline */}
                      {webshop.headline_active && webshop.headline_text ? (
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiTag} className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            Headline aktiv ({webshop.headline_speed || 10}s)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiTag} className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">Ingen headline</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(webshop)}
                        className="p-1 text-blue-600 hover:text-blue-700"
                        title="Rediger"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                      </button>
                      <a
                        href={webshop.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Besøg webshop"
                      >
                        <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(webshop.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                        title="Slet"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Webshop */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingWebshop ? 'Rediger Webshop' : 'Tilføj Webshop'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingWebshop(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Grundlæggende Information</h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Navn *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="F.eks. Zalando"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Slug genereres automatisk fra navnet
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beskrivelse
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kort beskrivelse af webshoppet"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo URL
                      </label>
                      <input
                        type="url"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.website_url}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trustpilot URL
                      </label>
                      <input
                        type="url"
                        value={formData.trustpilot_url}
                        onChange={(e) => setFormData({ ...formData, trustpilot_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://dk.trustpilot.com/review/example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rækkefølge
                      </label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Kategorier (vælg flere)</h4>
                  <div className="grid md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <label key={category.slug} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.categories.includes(category.slug)}
                          onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                          className="mr-2"
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* USP Management */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">USP Punkter</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Tilføj de unikke salgsargumenter der vises på webshop kortet (f.eks. "Dansk webshop", "Pålidelig levering")
                  </p>
                  <div className="space-y-2">
                    {formData.usp_items.map((usp, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={usp}
                          onChange={(e) => updateUSPItem(index, e.target.value)}
                          placeholder="F.eks. Dansk webshop, Pålidelig levering"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeUSPItem(index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addUSPItem}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                      Tilføj USP punkt
                    </button>
                  </div>
                </div>

                {/* Enhanced Running Headline */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Løbende Headline</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Tilføj en synlig headline der vises på webshop kortet (f.eks. "UDSALG 50%", "NY WEBSHOP")
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="headline_active"
                        checked={formData.headline_active}
                        onChange={(e) => setFormData({ ...formData, headline_active: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="headline_active" className="text-sm font-medium text-gray-700">
                        Aktiver headline
                      </label>
                    </div>

                    {formData.headline_active && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Headline tekst
                          </label>
                          <input
                            type="text"
                            value={formData.headline_text}
                            onChange={(e) => setFormData({ ...formData, headline_text: e.target.value })}
                            placeholder="F.eks. UDSALG 50%, NY WEBSHOP"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tekst farve
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={formData.headline_color}
                                onChange={(e) => setFormData({ ...formData, headline_color: e.target.value })}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={formData.headline_color}
                                onChange={(e) => setFormData({ ...formData, headline_color: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Baggrund farve
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={formData.headline_bg_color}
                                onChange={(e) => setFormData({ ...formData, headline_bg_color: e.target.value })}
                                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={formData.headline_bg_color}
                                onChange={(e) => setFormData({ ...formData, headline_bg_color: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Hastighed (sekunder)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="60"
                              value={formData.headline_speed}
                              onChange={(e) => setFormData({ ...formData, headline_speed: parseInt(e.target.value) || 10 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="10"
                            />
                            <p className="text-xs text-gray-500 mt-1">Tid for én fuld cyklus</p>
                          </div>
                        </div>

                        {/* Preview */}
                        {formData.headline_text && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 mb-2">Preview:</p>
                            <div 
                              className="overflow-hidden rounded-md"
                              style={{ backgroundColor: formData.headline_bg_color }}
                            >
                              <div 
                                className="text-xs px-2 py-1 font-medium whitespace-nowrap animate-marquee"
                                style={{ 
                                  color: formData.headline_color,
                                  animation: `marquee ${formData.headline_speed}s linear infinite`
                                }}
                              >
                                {formData.headline_text}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Other Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Øvrige Indstillinger</h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rabat tekst
                      </label>
                      <input
                        type="text"
                        value={formData.discount_text}
                        onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="F.eks. Fri fragt over 500 kr"
                      />
                    </div>
                  </div>

                  {/* Checkboxes and Dropdowns */}
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.emaerket}
                          onChange={(e) => setFormData({ ...formData, emaerket: e.target.checked })}
                          className="mr-2"
                        />
                        e-mærket certificeret
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.tryghedsmaerket}
                          onChange={(e) => setFormData({ ...formData, tryghedsmaerket: e.target.checked })}
                          className="mr-2"
                        />
                        Tryghedsmærket
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.mobilepay_accepted}
                          onChange={(e) => setFormData({ ...formData, mobilepay_accepted: e.target.checked })}
                          className="mr-2"
                        />
                        <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-1" />
                        MobilePay accepteret
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                          Land
                        </label>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="denmark">🇩🇰 Danmark</option>
                          <option value="norway">🇳🇴 Norge</option>
                          <option value="sweden">🇸🇪 Sverige</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="mr-2"
                        />
                        Udvalgt (vis på forsiden)
                      </label>
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
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingWebshop(null)
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

export default WebshopManager
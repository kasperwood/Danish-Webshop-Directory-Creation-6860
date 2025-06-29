import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiSave, FiUpload, FiImage, FiGlobe, FiSettings } = FiIcons

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    site_name: 'Webshop oversigt',
    site_description: 'Danmarks største webshop directory',
    logo_url: '/vite.svg', // Use webshop favicon as default
    favicon_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    meta_keywords: 'danske webshops,online shopping,e-handel Danmark',
    meta_description: 'Danmarks største webshop directory med over 1000+ verificerede webshops',
    google_analytics_id: '',
    facebook_pixel_id: '',
    contact_email: 'info@webshop-oversigt.dk',
    contact_phone: '',
    address: 'København, Danmark'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings_dk847392')
        .select('*')
        .limit(1)

      if (!error && data && data.length > 0) {
        setSettings(data[0])
      }
    } catch (error) {
      console.error('Error fetching site settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('site_settings_dk847392')
        .upsert([{
          ...settings,
          updated_at: new Date().toISOString()
        }])

      if (!error) {
        alert('Site indstillinger gemt succesfuldt!')
        // Reload the page to apply new logo
        window.location.reload()
      } else {
        alert('Fejl ved gemning af indstillinger')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Fejl ved gemning af indstillinger')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Site Indstillinger</h2>
          <p className="text-gray-600">Administrer grundlæggende site indstillinger og branding</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          {saving ? 'Gemmer...' : 'Gem Alle Indstillinger'}
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Site Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiGlobe} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Grundlæggende Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Navn *
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleInputChange('site_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Webshop oversigt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Beskrivelse
              </label>
              <textarea
                value={settings.site_description}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Danmarks største webshop directory"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Nøgleord
              </label>
              <input
                type="text"
                value={settings.meta_keywords}
                onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="danske webshops,online shopping,e-handel Danmark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Beskrivelse
              </label>
              <textarea
                value={settings.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Branding & Visual */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiImage} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Branding & Visuel</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL * (Standard: webshop favicon)
              </label>
              <input
                type="url"
                value={settings.logo_url}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/vite.svg"
              />
              {settings.logo_url && (
                <div className="mt-2">
                  <img 
                    src={settings.logo_url} 
                    alt="Logo preview" 
                    className="h-16 w-auto bg-gray-50 p-2 rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <div className="hidden text-sm text-red-600">Kunne ikke indlæse logo</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon URL
              </label>
              <input
                type="url"
                value={settings.favicon_url}
                onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primær Farve
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sekundær Farve
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Kontakt Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kontakt Email
              </label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@webshop-oversigt.dk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kontakt Telefon
              </label>
              <input
                type="tel"
                value={settings.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+45 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="København, Danmark"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Tracking */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Analytics & Tracking</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.google_analytics_id}
                onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="GA-XXXXXXXXX-X"
              />
              <p className="text-xs text-gray-500 mt-1">
                Indsæt dit Google Analytics tracking ID for at spore besøgende
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                value={settings.facebook_pixel_id}
                onChange={(e) => handleInputChange('facebook_pixel_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123456789012345"
              />
              <p className="text-xs text-gray-500 mt-1">
                Indsæt dit Facebook Pixel ID for at spore konverteringer
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-lg"
        >
          <SafeIcon icon={FiSave} className="w-5 h-5" />
          {saving ? 'Gemmer alle indstillinger...' : 'Gem Alle Indstillinger'}
        </motion.button>
      </div>
    </div>
  )
}

export default SiteSettings
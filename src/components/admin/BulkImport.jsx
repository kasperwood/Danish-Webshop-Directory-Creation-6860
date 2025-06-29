import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiUpload, FiCheck, FiX, FiAlertCircle, FiEye, FiEdit2, FiSave, FiTrash2, FiDownload, FiRefreshCw } = FiIcons

const BulkImport = () => {
  const [urls, setUrls] = useState('')
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [categories] = useState([
    { name: 'Herremode', slug: 'herremode' },
    { name: 'Damemode', slug: 'damemode' },
    { name: 'Børn', slug: 'boern' },
    { name: 'Sport og fritid', slug: 'sport-og-fritid' },
    { name: 'Hjemmet', slug: 'hjemmet' },
    { name: 'Elektronik', slug: 'elektronik' },
    { name: 'Voksen', slug: 'voksen' },
    { name: 'Mad og drikke', slug: 'mad-og-drikke' },
    { name: 'Rejser og oplevelser', slug: 'rejser-og-oplevelser' }
  ])

  // Extract domain from URL
  const extractDomain = (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      return domain
    } catch {
      return url
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

  // Simulate extracting data from URL (in real app, this would call an API)
  const extractWebsiteData = async (url) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

      const domain = extractDomain(url)
      const name = domain.split('.')[0]

      // Simulate extracted data - NO FAKE CERTIFICATIONS
      const mockData = {
        url,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        slug: generateSlug(name),
        description: '',  // Leave empty for bulk import
        logo_url: `https://logo.clearbit.com/${domain}`,
        website_url: url,
        trustpilot_url: `https://dk.trustpilot.com/review/${domain}`,
        categories: [],  // Leave empty for bulk import
        emaerket: false,  // ONLY set to true if actually verified
        tryghedsmaerket: false,  // ONLY set to true if actually verified
        mobilepay_accepted: false,  // Default to false
        danish_based: domain.endsWith('.dk'),
        discount_text: '',  // Leave empty for bulk import
        shipping_info: 'Levering 1-3 hverdage',
        special_offer: false,
        featured: false,
        status: 'inactive',  // Set to inactive by default
        sort_order: 0,
        usp_items: [],  // Leave empty for bulk import
        headline_text: '',
        headline_active: false,
        headline_color: '#ffffff',
        headline_bg_color: '#ff0000',
        headline_speed: 10
      }

      return { success: true, data: mockData }
    } catch (error) {
      return {
        success: false,
        error: `Kunne ikke hente data fra ${url}: ${error.message}`,
        data: { url, name: extractDomain(url), error: true }
      }
    }
  }

  const handleBulkProcess = async () => {
    if (!urls.trim()) return

    setProcessing(true)
    setResults([])

    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && url.startsWith('http'))

    if (urlList.length === 0) {
      // Silent error handling - no browser alert
      setProcessing(false)
      return
    }

    const processedResults = []
    for (const url of urlList) {
      const result = await extractWebsiteData(url)
      processedResults.push(result)
      setResults([...processedResults]) // Update UI in real-time
    }

    setProcessing(false)
    setShowPreview(true)
  }

  const handleEdit = (index) => {
    setEditingItem(index)
  }

  const handleSaveEdit = (index, updatedData) => {
    const newResults = [...results]
    newResults[index] = { ...newResults[index], data: updatedData }
    setResults(newResults)
    setEditingItem(null)
  }

  const handleRemove = (index) => {
    const newResults = results.filter((_, i) => i !== index)
    setResults(newResults)
  }

  const handleImportSelected = async () => {
    const validResults = results.filter(result => result.success && !result.data.error)

    if (validResults.length === 0) {
      // Silent error handling - no browser alert
      return
    }

    setProcessing(true)

    try {
      console.log('🎯 Starting bulk import...')

      // Prepare webshops for insertion
      const webshopsToInsert = validResults.map(result => {
        const data = result.data
        return {
          name: data.name,
          slug: data.slug,
          description: data.description || '',  // Leave empty
          logo_url: data.logo_url,
          website_url: data.website_url,
          trustpilot_url: data.trustpilot_url,
          categories: Array.isArray(data.categories) ? data.categories : [],  // Empty array
          emaerket: Boolean(data.emaerket),
          tryghedsmaerket: Boolean(data.tryghedsmaerket),
          mobilepay_accepted: Boolean(data.mobilepay_accepted),
          danish_based: Boolean(data.danish_based),
          discount_text: data.discount_text || '',  // Leave empty
          featured: Boolean(data.featured),
          status: 'inactive',  // Always set to inactive
          sort_order: data.sort_order || 0,
          usp_items: [],  // Empty array
          headline_text: data.headline_text || '',
          headline_active: Boolean(data.headline_active),
          headline_color: data.headline_color || '#ffffff',
          headline_bg_color: data.headline_bg_color || '#ff0000',
          headline_speed: data.headline_speed || 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      })

      console.log('📝 Inserting webshops:', webshopsToInsert)

      // Insert webshops into database
      const { data: insertedData, error } = await supabase
        .from('webshops_dk847392')
        .insert(webshopsToInsert)
        .select()

      if (error) {
        console.error('💥 Database error:', error)
        // Silent error handling - no browser alert
      } else {
        console.log('✅ Successfully inserted:', insertedData)
        // Silent success - no browser alert
        // Reset form
        setResults([])
        setUrls('')
        setShowPreview(false)
      }
    } catch (error) {
      console.error('💥 Unexpected error:', error)
      // Silent error handling - no browser alert
    } finally {
      setProcessing(false)
    }
  }

  const exportResults = () => {
    const csvContent = [
      ['Status', 'Navn', 'URL', 'Kategori', 'Dansk', 'e-mærket', 'Beskrivelse'],
      ...results.map(result => [
        result.success ? 'Succes' : 'Fejl',
        result.data.name || 'N/A',
        result.data.url || 'N/A',
        Array.isArray(result.data.categories) ? result.data.categories.join(',') : result.data.categories || 'N/A',
        result.data.danish_based ? 'Ja' : 'Nej',
        result.data.emaerket ? 'Ja' : 'Nej',
        result.data.description || result.error || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk-import-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const successCount = results.filter(r => r.success && !r.data.error).length
  const errorCount = results.filter(r => !r.success || r.data.error).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bulk Import</h2>
        <p className="text-gray-600">Importer flere webshops på én gang ved at indsætte deres URLs</p>
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Vigtigt:</strong> Importerede webshops er sat til "Inaktiv" status. Du skal manuelt aktivere, tilføje beskrivelser, kategorier og USP punkter efter import.
          </p>
        </div>
      </div>

      {!showPreview ? (
        /* URL Input Section */
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Webshop URLs (en per linje)
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="https://example.dk&#10;https://another-shop.com&#10;https://webshop.dk"
              rows="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Indsæt URLs til webshops du vil importere. Systemet vil automatisk forsøge at hente information om hver webshop.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleBulkProcess}
              disabled={processing || !urls.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <SafeIcon icon={processing ? FiRefreshCw : FiUpload} className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Behandler...' : 'Start Import'}
            </motion.button>
            {urls.trim() && (
              <p className="text-sm text-gray-600">
                {urls.split('\n').filter(url => url.trim() && url.startsWith('http')).length} URLs fundet
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Results Preview */
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Succesfulde</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiX} className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">Fejlede</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiUpload} className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Total</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{results.length}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleImportSelected}
              disabled={processing || successCount === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <SafeIcon icon={processing ? FiRefreshCw : FiSave} className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              {processing ? 'Importerer...' : `Importer ${successCount} Webshops (Inaktiv)`}
            </motion.button>
            <button
              onClick={exportResults}
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 flex items-center gap-2"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
              Eksporter Resultater
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-600 hover:text-gray-700 px-4 py-3"
            >
              Tilbage til URL Input
            </button>
          </div>

          {/* Results List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 border-b border-gray-200 ${
                    result.success && !result.data.error ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {editingItem === index ? (
                    <EditForm
                      data={result.data}
                      categories={categories}
                      onSave={(data) => handleSaveEdit(index, data)}
                      onCancel={() => setEditingItem(null)}
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <SafeIcon
                            icon={result.success && !result.data.error ? FiCheck : FiX}
                            className={`w-4 h-4 ${
                              result.success && !result.data.error ? 'text-green-600' : 'text-red-600'
                            }`}
                          />
                          <span className="font-medium">{result.data.name}</span>
                          {result.data.danish_based && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">DK</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{result.data.url}</div>
                        {result.success && !result.data.error ? (
                          <div className="text-sm text-gray-600">
                            <div>Status: Inaktiv (skal aktiveres manuelt)</div>
                            <div>Kategorier: Ikke angivet (skal tilføjes manuelt)</div>
                            <div>Beskrivelse: Ikke angivet (skal tilføjes manuelt)</div>
                            <div className="text-xs text-orange-600 mt-1">
                              ⚠️ Certificeringer skal verificeres manuelt
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-600">
                            Fejl: {result.error || 'Ukendt fejl'}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {result.success && !result.data.error && (
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                            title="Rediger"
                          >
                            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Fjern"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {processing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center gap-3">
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <div className="font-medium text-blue-900">Behandler webshops...</div>
              <div className="text-sm text-blue-700">
                {results.length > 0 && `${results.length} af ${urls.split('\n').filter(url => url.trim() && url.startsWith('http')).length} behandlet`}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Edit Form Component
const EditForm = ({ data, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState(data)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Navn</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategorier</label>
          <select
            value={Array.isArray(formData.categories) ? formData.categories[0] : formData.categories}
            onChange={(e) => setFormData({ ...formData, categories: [e.target.value] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rabat tekst</label>
          <input
            type="text"
            value={formData.discount_text}
            onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800 mb-2">
          <strong>Certificerings-verification påkrævet:</strong>
        </p>
        <p className="text-xs text-yellow-700">
          Verificer manuelt at webshoppet faktisk har disse certificeringer før du markerer dem.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.emaerket}
            onChange={(e) => setFormData({ ...formData, emaerket: e.target.checked })}
            className="mr-2"
          />
          e-mærket (kun hvis verificeret!)
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.tryghedsmaerket}
            onChange={(e) => setFormData({ ...formData, tryghedsmaerket: e.target.checked })}
            className="mr-2"
          />
          Tryghedsmærket (kun hvis verificeret!)
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.danish_based}
            onChange={(e) => setFormData({ ...formData, danish_based: e.target.checked })}
            className="mr-2"
          />
          Dansk webshop
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Annuller
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Gem ændringer
        </button>
      </div>
    </form>
  )
}

export default BulkImport
import React,{useState,useEffect} from 'react'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const {FiSave,FiUpload,FiImage,FiGlobe,FiRefreshCw}=FiIcons

const SiteSettings=()=> {
  const [settings,setSettings]=useState({
    site_name: 'Webshop oversigt',
    site_description: 'Danmarks største webshop directory',
    logo_url: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png',
    favicon_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#1e40af',
    meta_keywords: 'danske webshops,online shopping,e-handel Danmark',
    meta_description: 'Danmarks største webshop directory med over 1000+ verificerede webshops'
  })
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [existingId,setExistingId]=useState(null)

  useEffect(()=> {
    fetchSettings()
  },[])

  const fetchSettings=async ()=> {
    try {
      console.log('🔍 Fetching site settings...')
      const {data,error}=await supabase
        .from('site_settings_dk847392')
        .select('*')
        .limit(1)

      if (error) {
        console.error('❌ Error fetching settings:',error)
        // If table doesn't exist or is empty, we'll use defaults
      } else if (data && data.length > 0) {
        console.log('✅ Settings found:',data[0])
        setSettings(data[0])
        setExistingId(data[0].id)
      } else {
        console.log('ℹ️ No settings found, using defaults')
      }
    } catch (error) {
      console.error('💥 Unexpected error fetching settings:',error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave=async ()=> {
    setSaving(true)
    try {
      console.log('💾 Saving settings...')
      console.log('📝 Current settings:',settings)
      console.log('🆔 Existing ID:',existingId)

      let result
      if (existingId) {
        // Update existing record
        console.log('🔄 Updating existing record...')
        result=await supabase
          .from('site_settings_dk847392')
          .update(settings)
          .eq('id',existingId)
          .select()
      } else {
        // Insert new record
        console.log('➕ Inserting new record...')
        result=await supabase
          .from('site_settings_dk847392')
          .insert([settings])
          .select()
      }

      console.log('📊 Database result:',result)

      if (result.error) {
        console.error('❌ Database error:',result.error)
        alert('Fejl ved gemning: ' + result.error.message)
      } else {
        console.log('✅ Settings saved successfully!')
        
        // Update the existing ID if we just created a new record
        if (!existingId && result.data && result.data.length > 0) {
          setExistingId(result.data[0].id)
        }
        
        alert('Site indstillinger gemt succesfuldt!')
        
        // Reload the page to apply new settings
        setTimeout(()=> {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error('💥 Unexpected error saving settings:',error)
      alert('Uventet fejl ved gemning: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange=(field,value)=> {
    console.log(`🔧 Updating ${field}:`,value)
    setSettings(prev=> ({...prev,[field]: value}))
  }

  const testConnection=async ()=> {
    try {
      console.log('🔗 Testing database connection...')
      const {data,error}=await supabase
        .from('site_settings_dk847392')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('❌ Connection test failed:',error)
        alert('Database forbindelse fejlede: ' + error.message)
      } else {
        console.log('✅ Connection test successful')
        alert('Database forbindelse OK!')
      }
    } catch (error) {
      console.error('💥 Connection test error:',error)
      alert('Forbindelsesfejl: ' + error.message)
    }
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
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            Test Forbindelse
          </button>
          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <SafeIcon icon={saving ? FiRefreshCw : FiSave} className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Gemmer...' : 'Gem Indstillinger'}
          </motion.button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Debug Information</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>📊 Record ID: {existingId || 'Ny record'}</p>
          <p>🔧 Operation: {existingId ? 'UPDATE' : 'INSERT'}</p>
          <p>📝 Status: Klar til at gemme</p>
        </div>
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
                onChange={(e)=> handleInputChange('site_name',e.target.value)}
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
                onChange={(e)=> handleInputChange('site_description',e.target.value)}
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
                onChange={(e)=> handleInputChange('meta_keywords',e.target.value)}
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
                onChange={(e)=> handleInputChange('meta_description',e.target.value)}
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
                Logo URL *
              </label>
              <input
                type="url"
                value={settings.logo_url}
                onChange={(e)=> handleInputChange('logo_url',e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
              {settings.logo_url && (
                <div className="mt-2">
                  <img
                    src={settings.logo_url}
                    alt="Logo preview"
                    className="h-16 w-auto bg-gray-50 p-2 rounded border"
                    onError={(e)=> {
                      e.target.style.display='none'
                      e.target.nextSibling.style.display='block'
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
                onChange={(e)=> handleInputChange('favicon_url',e.target.value)}
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
                    onChange={(e)=> handleInputChange('primary_color',e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e)=> handleInputChange('primary_color',e.target.value)}
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
                    onChange={(e)=> handleInputChange('secondary_color',e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e)=> handleInputChange('secondary_color',e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-lg"
        >
          <SafeIcon icon={saving ? FiRefreshCw : FiSave} className={`w-5 h-5 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Gemmer alle indstillinger...' : 'Gem Alle Indstillinger'}
        </motion.button>
      </div>
    </div>
  )
}

export default SiteSettings
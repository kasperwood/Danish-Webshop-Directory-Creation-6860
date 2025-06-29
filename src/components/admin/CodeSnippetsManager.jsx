import React,{useState,useEffect} from 'react'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const {FiCode,FiSave,FiEye,FiEyeOff,FiAlertTriangle,FiCheckCircle,FiRefreshCw}=FiIcons

const CodeSnippetsManager=()=> {
  const [snippets,setSnippets]=useState({
    header_code: '',
    footer_code: '',
    body_start_code: '',
    body_end_code: ''
  })
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [activeTab,setActiveTab]=useState('header')
  const [previewMode,setPreviewMode]=useState({
    header: false,
    footer: false,
    body_start: false,
    body_end: false
  })

  useEffect(()=> {
    fetchCodeSnippets()
  },[])

  const fetchCodeSnippets=async ()=> {
    try {
      const {data,error}=await supabase
        .from('code_snippets_dk847392')
        .select('*')
        .limit(1)

      if (!error && data && data.length > 0) {
        setSnippets({
          header_code: data[0].header_code || '',
          footer_code: data[0].footer_code || '',
          body_start_code: data[0].body_start_code || '',
          body_end_code: data[0].body_end_code || ''
        })
      }
    } catch (error) {
      console.error('Error fetching code snippets:',error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave=async ()=> {
    setSaving(true)
    try {
      const {error}=await supabase
        .from('code_snippets_dk847392')
        .upsert([{
          ...snippets,
          updated_at: new Date().toISOString()
        }])

      if (!error) {
        alert('Code snippets gemt succesfuldt! Genindlæs siden for at se ændringerne.')
        // Refresh page to apply new code snippets
        setTimeout(()=> window.location.reload(),1000)
      } else {
        alert('Fejl ved gemning af code snippets')
      }
    } catch (error) {
      console.error('Error saving code snippets:',error)
      alert('Fejl ved gemning af code snippets')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange=(field,value)=> {
    setSnippets(prev=> ({...prev,[field]: value}))
  }

  const togglePreview=(type)=> {
    setPreviewMode(prev=> ({...prev,[type]: !prev[type]}))
  }

  const renderCodeEditor=(type,label,placeholder,description)=> {
    const value=snippets[`${type}_code`]
    const isPreview=previewMode[type]

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <button
            onClick={()=> togglePreview(type)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <SafeIcon icon={isPreview ? FiEyeOff : FiEye} className="w-4 h-4" />
            {isPreview ? 'Skjul preview' : 'Vis preview'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <textarea
              value={value}
              onChange={(e)=> handleInputChange(`${type}_code`,e.target.value)}
              placeholder={placeholder}
              rows="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{value.length} tegn</span>
              <span>{value.split('\n').length} linjer</span>
            </div>
          </div>

          {isPreview && value && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <SafeIcon icon={FiEye} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Live Preview:</span>
              </div>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                {value}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
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
          <h2 className="text-2xl font-bold text-gray-900">Code Snippets</h2>
          <p className="text-gray-600">Administrer site-wide HTML,CSS og JavaScript kode</p>
        </div>
        <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <SafeIcon icon={saving ? FiRefreshCw : FiSave} className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Gemmer...' : 'Gem Alle Snippets'}
        </motion.button>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Vigtigt at vide</h4>
            <ul className="text-sm text-yellow-800 mt-2 space-y-1">
              <li>• Code snippets indsættes på ALLE sider på websitet</li>
              <li>• Test altid koden grundigt før du gemmer</li>
              <li>• Forkert kode kan ødelægge sidens funktionalitet</li>
              <li>• Siden genindlæses automatisk efter gemning</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {id: 'header',label: 'Header Code',icon: FiCode},
              {id: 'body_start',label: 'Body Start',icon: FiCode},
              {id: 'body_end',label: 'Body End',icon: FiCode},
              {id: 'footer',label: 'Footer Code',icon: FiCode}
            ].map((tab)=> (
              <button
                key={tab.id}
                onClick={()=> setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab===tab.id
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
      </div>

      {/* Code Editors */}
      <div className="space-y-6">
        {activeTab==='header' && renderCodeEditor(
          'header',
          'Header Code (indsættes i <head>)',
          `<!-- Eksempel: Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Eksempel: Meta tags -->
<meta name="google-site-verification" content="your-verification-code" />`,
          'Kode der indsættes i sidens <head> sektion. Perfekt til analytics,meta tags,og CSS.'
        )}

        {activeTab==='body_start' && renderCodeEditor(
          'body_start',
          'Body Start Code (efter <body>)',
          `<!-- Eksempel: Google Tag Manager -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" 
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>

<!-- Eksempel: Chat widget -->
<script>
  // Chat integration code
</script>`,
          'Kode der indsættes lige efter <body> tagget. Bruges til tracking pixels og widgets.'
        )}

        {activeTab==='body_end' && renderCodeEditor(
          'body_end',
          'Body End Code (før </body>)',
          `<!-- Eksempel: Performance scripts -->
<script>
  // Scripts der skal loades til sidst
  console.log('Site loaded');
</script>

<!-- Eksempel: Cookie consent -->
<script src="https://cdn.cookielaw.org/consent/your-script.js"></script>`,
          'Kode der indsættes lige før </body> tagget. Optimal til scripts der ikke skal blokere page load.'
        )}

        {activeTab==='footer' && renderCodeEditor(
          'footer',
          'Footer Code (i footer komponenten)',
          `<!-- Eksempel: Social media widgets -->
<div id="facebook-widget"></div>

<!-- Eksempel: Newsletter popup -->
<script>
  // Newsletter signup modal
</script>

<!-- Eksempel: Additional analytics -->
<script>
  // Heatmap tracking
</script>`,
          'Kode der indsættes i footer komponenten. Synlig for brugerne i bunden af siden.'
        )}
      </div>

      {/* Common Use Cases */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-4">Almindelige anvendelser:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Header Code:</h5>
            <ul className="space-y-1">
              <li>• Google Analytics</li>
              <li>• Facebook Pixel</li>
              <li>• Meta tags</li>
              <li>• Custom CSS</li>
              <li>• Site verification</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Body/Footer Code:</h5>
            <ul className="space-y-1">
              <li>• Chat widgets</li>
              <li>• Cookie consent</li>
              <li>• Social media widgets</li>
              <li>• Newsletter popups</li>
              <li>• Performance scripts</li>
            </ul>
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
          <SafeIcon icon={saving ? FiRefreshCw : FiCheckCircle} className={`w-5 h-5 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Gemmer alle code snippets...' : 'Gem Alle Code Snippets'}
        </motion.button>
      </div>
    </div>
  )
}

export default CodeSnippetsManager
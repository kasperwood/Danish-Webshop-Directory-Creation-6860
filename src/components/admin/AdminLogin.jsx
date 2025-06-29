import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../hooks/useAuth'

const { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiCheckCircle, FiAlertCircle } = FiIcons

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@shopdk.dk')
  const [password, setPassword] = useState('ShopDK2024!Admin')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSetup, setShowSetup] = useState(false)
  const [setupData, setSetupData] = useState({
    fullName: 'System Administrator',
    email: 'admin@shopdk.dk',
    password: 'ShopDK2024!Admin'
  })

  const { signIn, createAdminUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('🔑 Attempting login with:', { email })

    const { error } = await signIn(email, password)
    
    if (error) {
      console.error('❌ Login error:', error)
      if (error.message?.includes('Invalid login credentials')) {
        setError('Email eller adgangskode er forkert. Prøv at oprette en admin bruger først.')
      } else {
        setError('Login fejl: ' + error.message)
      }
    } else {
      console.log('✅ Login successful!')
    }
    setLoading(false)
  }

  const handleSetupAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('🎯 Starting admin user creation process...')
      
      const result = await createAdminUser(setupData)
      
      if (result.error) {
        console.error('💥 Setup error:', result.error)
        let errorMessage = result.error.message || 'Ukendt fejl'
        
        // Handle specific error types
        if (errorMessage.includes('User already registered')) {
          errorMessage = 'En bruger med denne email eksisterer allerede. Prøv at logge ind i stedet.'
        } else if (errorMessage.includes('Password should be at least')) {
          errorMessage = 'Adgangskoden skal være mindst 6 tegn lang.'
        } else if (errorMessage.includes('duplicate key value violates unique constraint')) {
          errorMessage = 'En admin bruger med denne email eksisterer allerede. Prøv at logge ind.'
        }
        
        setError(`Fejl ved oprettelse: ${errorMessage}`)
      } else {
        console.log('🎉 Admin user created successfully!')
        setSuccess('Admin bruger oprettet succesfuldt! Du er nu logget ind.')
        
        // Clear form and switch back to login view after a short delay
        setTimeout(() => {
          setShowSetup(false)
          setEmail(setupData.email)
          setPassword(setupData.password)
          setSuccess('')
        }, 2000)
      }
    } catch (error) {
      console.error('💥 Unexpected setup error:', error)
      setError('Uventet fejl: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiLock} className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ShopDK Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {showSetup ? 'Opret første admin bruger' : 'Log ind for at administrere sitet'}
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          >
            <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          >
            <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        {!showSetup ? (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email adresse
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiMail} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@shopdk.dk"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Adgangskode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SafeIcon icon={FiLock} className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logger ind...' : 'Log ind'}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setShowSetup(true)
                  setError('')
                  setSuccess('')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                Opret første admin bruger
              </motion.button>
            </div>

            {/* Demo Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 text-center">
                <strong>Standard Login:</strong><br />
                Email: admin@shopdk.dk<br />
                Password: ShopDK2024!Admin
              </p>
            </div>
          </motion.form>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 space-y-6"
            onSubmit={handleSetupAdmin}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>🎯 Første gang setup:</strong> Opret din første admin bruger for at få adgang til admin panelet.
              </p>
              <p className="text-xs text-green-700 mt-1">
                Database er nu konfigureret korrekt for setup.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fulde navn
                </label>
                <input
                  type="text"
                  required
                  value={setupData.fullName}
                  onChange={(e) => setSetupData({ ...setupData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email adresse
                </label>
                <input
                  type="email"
                  required
                  value={setupData.email}
                  onChange={(e) => setSetupData({ ...setupData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adgangskode
                </label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={setupData.password}
                  onChange={(e) => setSetupData({ ...setupData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 tegn</p>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Opretter admin bruger...
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    Opret Admin Bruger
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setShowSetup(false)
                  setError('')
                  setSuccess('')
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Tilbage til login
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  )
}

export default AdminLogin
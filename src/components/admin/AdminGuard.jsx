import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiLock, FiEye, FiEyeOff } = FiIcons

const AdminGuard = ({ children }) => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const ADMIN_PASSWORD = 'KasperIsAIKing'

  useEffect(() => {
    // Check if user is already authenticated
    const savedAuth = sessionStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_authenticated', 'true')
    } else {
      setError('Forkert adgangskode. Prøv igen.')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('admin_authenticated')
    setPassword('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="mx-auto h-24 w-auto mb-6 flex justify-center">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png" 
                alt="Webshop oversigt" 
                className="h-24 w-auto"
              />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Admin Panel
            </h2>
            <p className="mt-2 text-gray-600">
              Indtast adgangskode for at få adgang til admin panelet
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Indtast din adgangskode"
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

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log ind
            </motion.button>
          </form>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-800 text-center">
              <strong>Sikker adgang:</strong><br />
              Kun autoriserede brugere har adgang til admin funktioner
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      {/* Logout button in top right */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Log ud
        </button>
      </div>
      {children}
    </div>
  )
}

export default AdminGuard
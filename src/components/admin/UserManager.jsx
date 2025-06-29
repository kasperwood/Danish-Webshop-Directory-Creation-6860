import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiUsers, FiShield, FiLock } = FiIcons

const UserManager = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <SafeIcon icon={FiLock} className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User Management Disabled
          </h2>
          <p className="text-gray-600 mb-6">
            User management functionality has been removed in public admin mode. 
            All admin features are now publicly accessible without authentication.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <SafeIcon icon={FiShield} className="w-5 h-5" />
              <span className="font-medium">Public Admin Mode</span>
            </div>
            <p className="text-sm text-blue-700">
              You now have full access to all admin features without needing to log in or manage users.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserManager
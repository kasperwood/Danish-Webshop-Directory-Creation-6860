import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiHome, FiShoppingBag, FiGrid, FiEdit3, FiBarChart3, FiSettings, FiMenu, FiX, FiBell, FiUpload, FiNavigation, FiLayout } = FiIcons

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'webshops', label: 'Webshops', icon: FiShoppingBag },
    { id: 'categories', label: 'Kategorier', icon: FiGrid },
    { id: 'bulk-import', label: 'Bulk Import', icon: FiUpload },
    { id: 'menu-footer', label: 'Menu & Footer', icon: FiNavigation },
    { id: 'site-settings', label: 'Site Indstillinger', icon: FiLayout },
    { id: 'blog', label: 'Blog', icon: FiEdit3 },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart3 },
    { id: 'settings', label: 'Indstillinger', icon: FiSettings }
  ]

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} lg:w-64`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <motion.div 
            className={`flex items-center gap-3 ${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}
            animate={{ opacity: sidebarOpen || window.innerWidth >= 1024 ? 1 : 0 }}
          >
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751187545596-freepik_br_814ede14-2fc7-447b-b665-328e08873468.png" 
              alt="Webshop oversigt" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-blue-600 text-lg">
              Admin
            </span>
          </motion.div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <SafeIcon icon={sidebarOpen ? FiX : FiMenu} className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5" />
              <span className={`ml-3 ${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t bg-white">
          <div className={`p-4 ${sidebarOpen || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
            <div className="text-sm text-gray-600 mb-2">
              Webshop oversigt
            </div>
            <div className="font-medium text-gray-900 text-sm">
              Admin Panel
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Sikker Admin Adgang
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-4 p-2 rounded hover:bg-gray-100"
            >
              <SafeIcon icon={FiMenu} className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' :
               activeTab === 'webshops' ? 'Webshops' :
               activeTab === 'categories' ? 'Kategorier' :
               activeTab === 'bulk-import' ? 'Bulk Import' :
               activeTab === 'menu-footer' ? 'Menu & Footer' :
               activeTab === 'site-settings' ? 'Site Indstillinger' :
               activeTab === 'blog' ? 'Blog' :
               activeTab === 'analytics' ? 'Analytics' :
               activeTab === 'settings' ? 'Indstillinger' :
               activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
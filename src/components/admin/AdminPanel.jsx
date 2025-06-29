import React, { useState } from 'react'
import AdminGuard from './AdminGuard'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import WebshopManager from './WebshopManager'
import CategoryManager from './CategoryManager'
import BlogManager from './BlogManager'
import BulkImport from './BulkImport'
import Analytics from './Analytics'
import MenuFooterManager from './MenuFooterManager'
import SiteSettings from './SiteSettings'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'webshops':
        return <WebshopManager />
      case 'categories':
        return <CategoryManager />
      case 'blog':
        return <BlogManager />
      case 'bulk-import':
        return <BulkImport />
      case 'menu-footer':
        return <MenuFooterManager />
      case 'site-settings':
        return <SiteSettings />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <AdminGuard>
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderActiveTab()}
      </AdminLayout>
    </AdminGuard>
  )
}

export default AdminPanel
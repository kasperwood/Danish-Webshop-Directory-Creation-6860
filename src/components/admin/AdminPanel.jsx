import React,{useState} from 'react'
import AdminGuard from './AdminGuard'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import WebshopManager from './WebshopManager'
import CategoryManager from './CategoryManager'
import BulkImport from './BulkImport'
import Analytics from './Analytics'
import SiteSettings from './SiteSettings'
import CodeSnippetsManager from './CodeSnippetsManager'

const AdminPanel=()=> {
  const [activeTab,setActiveTab]=useState('dashboard')

  const renderActiveTab=()=> {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'webshops':
        return <WebshopManager />
      case 'categories':
        return <CategoryManager />
      case 'bulk-import':
        return <BulkImport />
      case 'site-settings':
        return <SiteSettings />
      case 'code-snippets':
        return <CodeSnippetsManager />
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
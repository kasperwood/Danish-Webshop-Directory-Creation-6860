import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiMove, FiEye, FiEyeOff } = FiIcons

const CategoryManager = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    status: 'active'
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories_dk847392')
        .select('*')
        .order('sort_order')

      if (!error) {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const categoryData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        updated_at: new Date().toISOString()
      }

      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories_dk847392')
          .update(categoryData)
          .eq('id', editingCategory.id)

        if (!error) {
          await fetchCategories()
          setShowModal(false)
          setEditingCategory(null)
        }
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories_dk847392')
          .insert([categoryData])

        if (!error) {
          await fetchCategories()
          setShowModal(false)
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setLoading(false)
      resetForm()
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      sort_order: category.sort_order,
      status: category.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    // Removed browser confirm dialog
    try {
      const { error } = await supabase
        .from('categories_dk847392')
        .delete()
        .eq('id', id)

      if (!error) {
        await fetchCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const toggleStatus = async (category) => {
    try {
      const newStatus = category.status === 'active' ? 'inactive' : 'active'
      const { error } = await supabase
        .from('categories_dk847392')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', category.id)

      if (!error) {
        await fetchCategories()
      }
    } catch (error) {
      console.error('Error updating category status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      sort_order: 0,
      status: 'active'
    })
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
          <h2 className="text-2xl font-bold text-gray-900">Kategorier</h2>
          <p className="text-gray-600">Administrer webshop kategorier</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Tilføj Kategori
        </motion.button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Rækkefølge</th>
                <th className="text-left p-4 font-semibold text-gray-900">Navn</th>
                <th className="text-left p-4 font-semibold text-gray-900">Slug</th>
                <th className="text-left p-4 font-semibold text-gray-900">Beskrivelse</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Ingen kategorier fundet. Opret din første kategori.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <SafeIcon icon={FiMove} className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{category.sort_order}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="p-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">{category.slug}</code>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-600 max-w-xs truncate">
                        {category.description || 'Ingen beskrivelse'}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(category)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          category.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <SafeIcon icon={category.status === 'active' ? FiEye : FiEyeOff} className="w-3 h-3" />
                        {category.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Rediger"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Slet"
                        >
                          <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'Rediger Kategori' : 'Tilføj Kategori'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingCategory(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Navn *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setFormData({
                        ...formData,
                        name,
                        slug: formData.slug || generateSlug(name)
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beskrivelse
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rækkefølge
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Aktiv</option>
                      <option value="inactive">Inaktiv</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingCategory(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Annuller
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    {loading ? 'Gemmer...' : 'Gem'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
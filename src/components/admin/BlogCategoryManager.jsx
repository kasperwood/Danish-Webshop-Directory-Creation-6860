import React,{useState,useEffect} from 'react'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const {FiPlus,FiEdit2,FiTrash2,FiSave,FiX,FiMove,FiEye,FiEyeOff,FiTag}=FiIcons

const BlogCategoryManager=()=> {
  const [categories,setCategories]=useState([])
  const [loading,setLoading]=useState(true)
  const [showModal,setShowModal]=useState(false)
  const [editingCategory,setEditingCategory]=useState(null)
  const [formData,setFormData]=useState({
    name: '',
    slug: '',
    description: '',
    color: '#3b82f6',
    icon: 'FiTag',
    sort_order: 0,
    status: 'active',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  })

  useEffect(()=> {
    fetchCategories()
  },[])

  const fetchCategories=async ()=> {
    try {
      const {data,error}=await supabase
        .from('blog_categories_dk847392')
        .select('*')
        .order('sort_order')

      if (!error) {
        setCategories(data || [])
      } else {
        console.error('Error fetching blog categories:',error)
      }
    } catch (error) {
      console.error('Error fetching blog categories:',error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug=(name)=> {
    return name
      .toLowerCase()
      .replace(/[æøå]/g,(match)=> {
        const map={'æ': 'ae','ø': 'oe','å': 'aa'}
        return map[match]
      })
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'')
  }

  const handleSubmit=async (e)=> {
    e.preventDefault()
    setLoading(true)

    try {
      const categoryData={
        name: formData.name.trim(),
        slug: formData.slug.trim() || generateSlug(formData.name),
        description: formData.description.trim(),
        color: formData.color,
        icon: formData.icon,
        sort_order: parseInt(formData.sort_order) || 0,
        status: formData.status,
        meta_title: formData.meta_title.trim() || `${formData.name} | Blog | Webshop Oversigt`,
        meta_description: formData.meta_description.trim() || `Læs de bedste artikler om ${formData.name.toLowerCase()} på Webshop Oversigt blog.`,
        meta_keywords: formData.meta_keywords.trim(),
        updated_at: new Date().toISOString()
      }

      console.log('🎯 Submitting category data:',categoryData)

      if (editingCategory) {
        const {error}=await supabase
          .from('blog_categories_dk847392')
          .update(categoryData)
          .eq('id',editingCategory.id)

        if (error) {
          console.error('💥 Update error:',error)
          alert('Fejl ved opdatering: ' + error.message)
        } else {
          console.log('✅ Category updated successfully')
          await fetchCategories()
          setShowModal(false)
          setEditingCategory(null)
          resetForm()
          alert('Kategori opdateret succesfuldt!')
        }
      } else {
        const {data,error}=await supabase
          .from('blog_categories_dk847392')
          .insert([categoryData])
          .select()

        if (error) {
          console.error('💥 Insert error:',error)
          alert('Fejl ved oprettelse: ' + error.message)
        } else {
          console.log('✅ Category created successfully:',data)
          await fetchCategories()
          setShowModal(false)
          resetForm()
          alert('Kategori oprettet succesfuldt!')
        }
      }
    } catch (error) {
      console.error('💥 Unexpected error:',error)
      alert('Uventet fejl: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit=(category)=> {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color || '#3b82f6',
      icon: category.icon || 'FiTag',
      sort_order: category.sort_order,
      status: category.status,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || '',
      meta_keywords: category.meta_keywords || ''
    })
    setShowModal(true)
  }

  const handleDelete=async (id)=> {
    if (confirm('Er du sikker på at du vil slette denne kategori?')) {
      try {
        const {error}=await supabase
          .from('blog_categories_dk847392')
          .delete()
          .eq('id',id)

        if (!error) {
          await fetchCategories()
          alert('Kategori slettet succesfuldt!')
        } else {
          console.error('Delete error:',error)
          alert('Fejl ved sletning: ' + error.message)
        }
      } catch (error) {
        console.error('Error deleting blog category:',error)
        alert('Uventet fejl ved sletning: ' + error.message)
      }
    }
  }

  const toggleStatus=async (category)=> {
    try {
      const newStatus=category.status==='active' ? 'inactive' : 'active'
      const {error}=await supabase
        .from('blog_categories_dk847392')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id',category.id)

      if (!error) {
        await fetchCategories()
      }
    } catch (error) {
      console.error('Error updating category status:',error)
    }
  }

  const resetForm=()=> {
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#3b82f6',
      icon: 'FiTag',
      sort_order: 0,
      status: 'active',
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    })
  }

  const iconOptions=[
    {value: 'FiTag',label: 'Tag'},
    {value: 'FiShoppingBag',label: 'Shopping'},
    {value: 'FiStar',label: 'Star'},
    {value: 'FiTrendingUp',label: 'Trending'},
    {value: 'FiBook',label: 'Book'},
    {value: 'FiUser',label: 'User'},
    {value: 'FiHeart',label: 'Heart'},
    {value: 'FiTarget',label: 'Target'}
  ]

  if (loading && categories.length===0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header - More Compact */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blog Kategorier</h2>
          <p className="text-sm text-gray-600">Administrer blog kategorier</p>
        </div>
        <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          onClick={()=> setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 text-sm"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Tilføj Kategori
        </motion.button>
      </div>

      {/* Categories List - More Compact */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-2 font-medium text-gray-900 text-sm">Rækkefølge</th>
                <th className="text-left p-2 font-medium text-gray-900 text-sm">Kategori</th>
                <th className="text-left p-2 font-medium text-gray-900 text-sm">Beskrivelse</th>
                <th className="text-left p-2 font-medium text-gray-900 text-sm">Status</th>
                <th className="text-left p-2 font-medium text-gray-900 text-sm">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {categories.length===0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">📁</div>
                      <h3 className="text-sm font-medium mb-1">Ingen kategorier endnu</h3>
                      <p className="text-xs mb-2">Opret din første blog kategori</p>
                      <button
                        onClick={()=> setShowModal(true)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        Opret første kategori
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category)=> (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <SafeIcon icon={FiMove} className="w-3 h-3 text-gray-400" />
                        <span className="font-medium text-sm">{category.sort_order}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white"
                          style={{backgroundColor: category.color}}
                        >
                          <SafeIcon icon={FiIcons[category.icon] || FiTag} className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{category.name}</div>
                          <code className="text-xs text-gray-500">{category.slug}</code>
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="text-gray-600 text-xs max-w-xs truncate">
                        {category.description || 'Ingen beskrivelse'}
                      </div>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={()=> toggleStatus(category)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          category.status==='active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        <SafeIcon icon={category.status==='active' ? FiEye : FiEyeOff} className="w-3 h-3" />
                        {category.status==='active' ? 'Aktiv' : 'Inaktiv'}
                      </button>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={()=> handleEdit(category)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Rediger"
                        >
                          <SafeIcon icon={FiEdit2} className="w-3 h-3" />
                        </button>
                        <button
                          onClick={()=> handleDelete(category.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Slet"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
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
            initial={{opacity: 0,scale: 0.95}}
            animate={{opacity: 1,scale: 1}}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'Rediger Kategori' : 'Tilføj Kategori'}
                </h3>
                <button
                  onClick={()=> {
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
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Navn *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e)=> {
                        const name=e.target.value
                        setFormData({
                          ...formData,
                          name,
                          slug: formData.slug || generateSlug(name),
                          meta_title: formData.meta_title || `${name} | Blog | Webshop Oversigt`
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Shopping Guides"
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
                      onChange={(e)=> setFormData({...formData,slug: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="shopping-guides"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beskrivelse
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e)=> setFormData({...formData,description: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Beskrivelse af kategorien"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Farve
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e)=> setFormData({...formData,color: e.target.value})}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e)=> setFormData({...formData,color: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ikon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e)=> setFormData({...formData,icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {iconOptions.map((option)=> (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rækkefølge
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e)=> setFormData({...formData,sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e)=> setFormData({...formData,status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="active">Aktiv</option>
                      <option value="inactive">Inaktiv</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={()=> {
                      setShowModal(false)
                      setEditingCategory(null)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Annuller
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{scale: 1.05}}
                    whileTap={{scale: 0.95}}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    {loading ? 'Gemmer...' : 'Gem Kategori'}
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

export default BlogCategoryManager
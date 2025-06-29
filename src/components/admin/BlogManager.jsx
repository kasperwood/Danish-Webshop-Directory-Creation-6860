import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiEye, FiEyeOff, FiCalendar, FiUser } = FiIcons

const BlogManager = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    image_url: '',
    status: 'draft',
    featured: false,
    read_time: '5 min'
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title) => {
    return title
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
      const postData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        updated_at: new Date().toISOString()
      }

      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts_dk847392')
          .update(postData)
          .eq('id', editingPost.id)

        if (!error) {
          await fetchPosts()
          setShowModal(false)
          setEditingPost(null)
        }
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts_dk847392')
          .insert([postData])

        if (!error) {
          await fetchPosts()
          setShowModal(false)
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
    } finally {
      setLoading(false)
      resetForm()
    }
  }

  const handleEdit = (post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      image_url: post.image_url || '',
      status: post.status,
      featured: post.featured || false,
      read_time: post.read_time || '5 min'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Er du sikker på, at du vil slette denne blog post?')) {
      try {
        const { error } = await supabase
          .from('blog_posts_dk847392')
          .delete()
          .eq('id', id)

        if (!error) {
          await fetchPosts()
        }
      } catch (error) {
        console.error('Error deleting blog post:', error)
      }
    }
  }

  const toggleStatus = async (post) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published'
      const { error } = await supabase
        .from('blog_posts_dk847392')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', post.id)

      if (!error) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: '',
      image_url: '',
      status: 'draft',
      featured: false,
      read_time: '5 min'
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
          <h2 className="text-2xl font-bold text-gray-900">Blog Artikler</h2>
          <p className="text-gray-600">Administrer blog indlæg og artikler</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Ny Artikel
        </motion.button>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Titel</th>
                <th className="text-left p-4 font-semibold text-gray-900">Forfatter</th>
                <th className="text-left p-4 font-semibold text-gray-900">Kategori</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Dato</th>
                <th className="text-left p-4 font-semibold text-gray-900">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    Ingen blog artikler fundet. Opret din første artikel.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                        {post.featured && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                            Fremhævet
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{post.author || 'Ingen forfatter'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {post.category || 'Ingen kategori'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(post)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <SafeIcon icon={post.status === 'published' ? FiEye : FiEyeOff} className="w-3 h-3" />
                        {post.status === 'published' ? 'Udgivet' : 'Kladde'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString('da-DK')}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Rediger"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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

      {/* Modal for Add/Edit Post */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingPost ? 'Rediger Artikel' : 'Ny Artikel'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingPost(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titel *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setFormData({
                          ...formData,
                          title,
                          slug: formData.slug || generateSlug(title)
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uddrag
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kort beskrivelse af artiklen..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indhold
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Artikelens indhold (Markdown understøttet)..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forfatter
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Vælg kategori</option>
                      <option value="Guides">Guides</option>
                      <option value="Anmeldelser">Anmeldelser</option>
                      <option value="Sikkerhed">Sikkerhed</option>
                      <option value="Bæredygtighed">Bæredygtighed</option>
                      <option value="Analyse">Analyse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Læsetid
                    </label>
                    <input
                      type="text"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5 min"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (komma-separeret)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="shopping, tilbud, besparelser"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billede URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Kladde</option>
                      <option value="published">Udgivet</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Fremhævet artikel</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingPost(null)
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

export default BlogManager
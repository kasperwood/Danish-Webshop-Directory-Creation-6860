import React,{useState,useEffect} from 'react'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'
import SchemaGenerator from './SchemaGenerator'
import SEOScorer from './SEOScorer'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const {FiPlus,FiEdit2,FiTrash2,FiSave,FiX,FiEye,FiEyeOff,FiCalendar,FiUser,FiExternalLink,FiCopy,FiTrendingUp,FiCode,FiTarget}=FiIcons

const BlogManager=()=> {
  const [posts,setPosts]=useState([])
  const [webshops,setWebshops]=useState([])
  const [categories,setCategories]=useState([])
  const [loading,setLoading]=useState(true)
  const [showModal,setShowModal]=useState(false)
  const [editingPost,setEditingPost]=useState(null)
  const [activeTab,setActiveTab]=useState('basic')
  const [showSchemaGenerator,setShowSchemaGenerator]=useState(false)
  const [formData,setFormData]=useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    focus_keyword: '',
    featured_image: '',
    status: 'draft',
    featured: false,
    read_time: '5 min',
    seo_title: '',
    meta_description: '',
    meta_keywords: '',
    schema_markup: ''
  })

  // Quill modules with webshop button
  const quillModules={
    toolbar: {
      container: [
        [{'header': [1,2,3,false]}],
        ['bold','italic','underline','strike'],
        [{'list': 'ordered'},{'list': 'bullet'}],
        ['blockquote','code-block'],
        ['link','image'],
        [{'color': []},{'background': []}],
        [{'align': []}],
        ['clean'],
        ['webshop'] // Custom webshop button
      ],
      handlers: {
        'webshop': function() {
          const range=this.quill.getSelection()
          if (range) {
            // Show webshop picker modal
            setShowWebshopPicker(true)
          }
        }
      }
    }
  }

  const quillFormats=[
    'header','bold','italic','underline','strike',
    'list','bullet','blockquote','code-block',
    'link','image','color','background','align'
  ]

  const [showWebshopPicker,setShowWebshopPicker]=useState(false)

  useEffect(()=> {
    fetchPosts()
    fetchWebshops()
    fetchCategories()
  },[])

  const fetchPosts=async ()=> {
    try {
      const {data,error}=await supabase
        .from('blog_posts_dk847392')
        .select('*')
        .order('created_at',{ascending: false})

      if (!error) {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error fetching blog posts:',error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWebshops=async ()=> {
    try {
      const {data,error}=await supabase
        .from('webshops_dk847392')
        .select('id,name,logo_url,description,website_url')
        .eq('status','active')
        .order('name')

      if (!error) {
        setWebshops(data || [])
      }
    } catch (error) {
      console.error('Error fetching webshops:',error)
    }
  }

  const fetchCategories=async ()=> {
    try {
      const {data,error}=await supabase
        .from('blog_categories_dk847392')
        .select('*')
        .eq('status','active')
        .order('sort_order')

      if (!error) {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error fetching blog categories:',error)
    }
  }

  const generateSlug=(title)=> {
    return title
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
      const postData={
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags ? formData.tags.split(',').map(tag=> tag.trim()) : [],
        updated_at: new Date().toISOString(),
        // Auto-generate SEO fields if not provided
        seo_title: formData.seo_title || `${formData.title} | Webshop Oversigt`,
        meta_description: formData.meta_description || formData.excerpt,
        meta_keywords: formData.meta_keywords || (formData.tags ? formData.tags.replace(/,/g,',') : '')
      }

      if (editingPost) {
        const {error}=await supabase
          .from('blog_posts_dk847392')
          .update(postData)
          .eq('id',editingPost.id)

        if (!error) {
          await fetchPosts()
          setShowModal(false)
          setEditingPost(null)
          alert('Artikel opdateret succesfuldt!')
        } else {
          console.error('Update error:',error)
          alert('Fejl ved opdatering: ' + error.message)
        }
      } else {
        const {error}=await supabase
          .from('blog_posts_dk847392')
          .insert([{
            ...postData,
            view_count: 0
          }])

        if (!error) {
          await fetchPosts()
          setShowModal(false)
          alert('Artikel oprettet succesfuldt!')
        } else {
          console.error('Insert error:',error)
          alert('Fejl ved oprettelse: ' + error.message)
        }
      }
    } catch (error) {
      console.error('Error saving blog post:',error)
      alert('Uventet fejl ved gemning: ' + error.message)
    } finally {
      setLoading(false)
      resetForm()
    }
  }

  const handleEdit=(post)=> {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(',') : '',
      focus_keyword: post.focus_keyword || '',
      featured_image: post.featured_image || '',
      status: post.status,
      featured: post.featured || false,
      read_time: post.read_time || '5 min',
      seo_title: post.seo_title || '',
      meta_description: post.meta_description || '',
      meta_keywords: post.meta_keywords || '',
      schema_markup: post.schema_markup || ''
    })
    setShowModal(true)
  }

  const handleDelete=async (id)=> {
    if (confirm('Er du sikker på at du vil slette denne artikel?')) {
      try {
        const {error}=await supabase
          .from('blog_posts_dk847392')
          .delete()
          .eq('id',id)

        if (!error) {
          await fetchPosts()
          alert('Artikel slettet succesfuldt!')
        } else {
          console.error('Delete error:',error)
          alert('Fejl ved sletning: ' + error.message)
        }
      } catch (error) {
        console.error('Error deleting blog post:',error)
        alert('Uventet fejl ved sletning: ' + error.message)
      }
    }
  }

  const toggleStatus=async (post)=> {
    try {
      const newStatus=post.status==='published' ? 'draft' : 'published'
      const {error}=await supabase
        .from('blog_posts_dk847392')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
          published_at: newStatus==='published' ? new Date().toISOString() : null
        })
        .eq('id',post.id)

      if (!error) {
        await fetchPosts()
      }
    } catch (error) {
      console.error('Error updating post status:',error)
    }
  }

  const insertWebshopShortcode=(webshopId)=> {
    const shortcode=`[webshop:${webshopId}]`
    const currentContent=formData.content
    setFormData({...formData,content: currentContent + '\n\n' + shortcode})
    setShowWebshopPicker(false)
  }

  const resetForm=()=> {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: '',
      focus_keyword: '',
      featured_image: '',
      status: 'draft',
      featured: false,
      read_time: '5 min',
      seo_title: '',
      meta_description: '',
      meta_keywords: '',
      schema_markup: ''
    })
    setActiveTab('basic')
  }

  const copyShortcode=(webshopId)=> {
    navigator.clipboard.writeText(`[webshop:${webshopId}]`)
    alert('Shortcode kopieret!')
  }

  const handleSchemaGenerated=(schema)=> {
    setFormData({...formData,schema_markup: schema})
  }

  if (loading && posts.length===0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Blog Manager</h2>
          <p className="text-gray-600">Administrer blog artikler med fokus nøgleord optimering og SEO-scoring</p>
        </div>
        <motion.button
          whileHover={{scale: 1.05}}
          whileTap={{scale: 0.95}}
          onClick={()=> setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          Ny Artikel
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
          <div className="text-sm text-blue-700">Total artikler</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {posts.filter(p=> p.status==='published').length}
          </div>
          <div className="text-sm text-green-700">Udgivet</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {posts.filter(p=> p.status==='draft').length}
          </div>
          <div className="text-sm text-yellow-700">Kladder</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {posts.reduce((sum,p)=> sum + (p.view_count || 0),0).toLocaleString()}
          </div>
          <div className="text-sm text-purple-700">Total visninger</div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Artikel</th>
                <th className="text-left p-4 font-semibold text-gray-900">Fokus Nøgleord</th>
                <th className="text-left p-4 font-semibold text-gray-900">Forfatter</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                <th className="text-left p-4 font-semibold text-gray-900">Visninger</th>
                <th className="text-left p-4 font-semibold text-gray-900">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {posts.length===0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="text-gray-500">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-semibold mb-2">Ingen artikler endnu</h3>
                      <p className="mb-4">Kom i gang med at skrive din første blog artikel</p>
                      <button
                        onClick={()=> setShowModal(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Opret første artikel
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post)=> (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {post.featured_image && (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{post.title}</div>
                          <div className="text-sm text-gray-500">/{post.slug}</div>
                          {post.featured && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                              Fremhævet
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {post.focus_keyword ? (
                        <div className="flex items-center gap-1">
                          <SafeIcon icon={FiTarget} className="w-3 h-3 text-blue-600" />
                          <span className="text-sm text-blue-800 font-medium">"{post.focus_keyword}"</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Ikke angivet</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{post.author || 'Admin'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={()=> toggleStatus(post)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          post.status==='published'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <SafeIcon icon={post.status==='published' ? FiEye : FiEyeOff} className="w-3 h-3" />
                        {post.status==='published' ? 'Udgivet' : 'Kladde'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-900 font-medium">
                        {(post.view_count || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {post.status==='published' && (
                          <a
                            href={`#/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Se artikel"
                          >
                            <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={()=> handleEdit(post)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          title="Rediger"
                        >
                          <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={()=> handleDelete(post.id)}
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
            initial={{opacity: 0,scale: 0.95}}
            animate={{opacity: 1,scale: 1}}
            className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingPost ? 'Rediger Artikel' : 'Ny Artikel'}
                </h3>
                <button
                  onClick={()=> {
                    setShowModal(false)
                    setEditingPost(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      {[
                        {id: 'basic',label: 'Indhold',icon: FiEdit2},
                        {id: 'seo',label: 'SEO',icon: FiTrendingUp},
                        {id: 'webshops',label: 'Webshops',icon: FiExternalLink}
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

                  <form onSubmit={handleSubmit}>
                    {/* Basic Tab */}
                    {activeTab==='basic' && (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Titel *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.title}
                              onChange={(e)=> {
                                const title=e.target.value
                                setFormData({
                                  ...formData,
                                  title,
                                  slug: formData.slug || generateSlug(title),
                                  seo_title: formData.seo_title || `${title} | Webshop Oversigt`
                                })
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Indtast artikel titel"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Slug *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.slug}
                              onChange={(e)=> setFormData({...formData,slug: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="artikel-slug"
                            />
                          </div>
                        </div>

                        {/* Focus Keyword */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <SafeIcon icon={FiTarget} className="w-5 h-5 text-blue-600" />
                            <h4 className="font-semibold text-blue-900">Fokus Nøgleord for SEO</h4>
                          </div>
                          <input
                            type="text"
                            value={formData.focus_keyword}
                            onChange={(e)=> setFormData({...formData,focus_keyword: e.target.value})}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="f.eks. danske webshops,online shopping guide"
                          />
                          <p className="text-sm text-blue-700 mt-2">
                            Dette nøgleord bruges til at optimere SEO scoren. Brug det naturligt gennem hele artiklen.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uddrag
                          </label>
                          <textarea
                            value={formData.excerpt}
                            onChange={(e)=> setFormData({...formData,excerpt: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Kort beskrivelse af artiklen (anbefales for SEO)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Indhold (WYSIWYG Editor)
                          </label>
                          <div className="border rounded-lg overflow-hidden">
                            <ReactQuill
                              theme="snow"
                              value={formData.content}
                              onChange={(content)=> setFormData({...formData,content})}
                              modules={quillModules}
                              formats={quillFormats}
                              style={{minHeight: '300px'}}
                              placeholder="Skriv dit indhold her... Brug værktøjslinjen til formatering og indsæt webshop kort med [webshop:ID]"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Tip: Brug dit fokus nøgleord naturligt gennem teksten for bedre SEO
                          </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Forfatter
                            </label>
                            <input
                              type="text"
                              value={formData.author}
                              onChange={(e)=> setFormData({...formData,author: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Forfatter navn"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kategori
                            </label>
                            <select
                              value={formData.category}
                              onChange={(e)=> setFormData({...formData,category: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Vælg kategori</option>
                              {categories.map((category)=> (
                                <option key={category.id} value={category.slug}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Læsetid
                            </label>
                            <input
                              type="text"
                              value={formData.read_time}
                              onChange={(e)=> setFormData({...formData,read_time: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="5 min"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (komma-separeret)
                          </label>
                          <input
                            type="text"
                            value={formData.tags}
                            onChange={(e)=> setFormData({...formData,tags: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="danske webshops,online shopping,guides"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fremhævet billede URL
                          </label>
                          <input
                            type="url"
                            value={formData.featured_image}
                            onChange={(e)=> setFormData({...formData,featured_image: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://images.unsplash.com/..."
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              value={formData.status}
                              onChange={(e)=> setFormData({...formData,status: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="draft">Kladde</option>
                              <option value="published">Udgivet</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e)=> setFormData({...formData,featured: e.target.checked})}
                                className="rounded"
                              />
                              <span className="text-sm font-medium text-gray-700">Fremhævet artikel</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab==='seo' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-blue-900 mb-2">SEO Optimering</h4>
                          <p className="text-sm text-blue-800">
                            Optimer din artikel for søgemaskiner. Felter der er tomme vil automatisk blive genereret.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SEO Titel
                          </label>
                          <input
                            type="text"
                            value={formData.seo_title}
                            onChange={(e)=> setFormData({...formData,seo_title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Automatisk genereret fra titel"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Anbefalet længde: 50-60 tegn. Nuværende: {formData.seo_title.length}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Beskrivelse
                          </label>
                          <textarea
                            value={formData.meta_description}
                            onChange={(e)=> setFormData({...formData,meta_description: e.target.value})}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Automatisk genereret fra uddrag"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Anbefalet længde: 150-160 tegn. Nuværende: {formData.meta_description.length}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Nøgleord
                          </label>
                          <input
                            type="text"
                            value={formData.meta_keywords}
                            onChange={(e)=> setFormData({...formData,meta_keywords: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="danske webshops,online shopping,shopping guide"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Schema Markup (JSON-LD)
                            </label>
                            <button
                              type="button"
                              onClick={()=> setShowSchemaGenerator(true)}
                              className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              Generer Schema
                            </button>
                          </div>
                          <textarea
                            value={formData.schema_markup}
                            onChange={(e)=> setFormData({...formData,schema_markup: e.target.value})}
                            rows="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder='{"@context": "https://schema.org","@type": "Article",...}'
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Avanceret: Struktureret data for bedre SEO
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Webshops Tab */}
                    {activeTab==='webshops' && (
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-green-900 mb-2">Webshop Integration</h4>
                          <p className="text-sm text-green-800 mb-3">
                            Indsæt webshop kort direkte i dine artikler ved hjælp af shortcodes.
                          </p>
                          <div className="bg-white border border-green-300 rounded p-3">
                            <code className="text-sm text-gray-800">
                              Brug: <strong>[webshop:ID]</strong> hvor du vil indsætte et webshop kort
                            </code>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Tilgængelige Webshops:</h4>
                          <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                            {webshops.map((webshop)=> (
                              <div key={webshop.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center p-2">
                                    <img
                                      src={webshop.logo_url}
                                      alt={webshop.name}
                                      className="max-w-full max-h-full object-contain"
                                      onError={(e)=> {
                                        e.target.style.display='none'
                                        e.target.nextSibling.style.display='flex'
                                      }}
                                    />
                                    <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                      {webshop.name.charAt(0)}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{webshop.name}</h5>
                                    <p className="text-sm text-gray-600 line-clamp-2">{webshop.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                                    [webshop:{webshop.id}]
                                  </code>
                                  <button
                                    type="button"
                                    onClick={()=> copyShortcode(webshop.id)}
                                    className="text-blue-600 hover:text-blue-700 p-1"
                                    title="Kopier shortcode"
                                  >
                                    <SafeIcon icon={FiCopy} className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={()=> insertWebshopShortcode(webshop.id)}
                                    className="text-green-600 hover:text-green-700 p-1"
                                    title="Indsæt i indhold"
                                  >
                                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={()=> {
                          setShowModal(false)
                          setEditingPost(null)
                          resetForm()
                        }}
                        className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Annuller
                      </button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                      >
                        <SafeIcon icon={FiSave} className="w-4 h-4" />
                        {loading ? 'Gemmer...' : 'Gem Artikel'}
                      </motion.button>
                    </div>
                  </form>
                </div>

                {/* Sidebar with SEO Score */}
                <div className="lg:col-span-1">
                  <div className="sticky top-6 space-y-4">
                    <SEOScorer postData={formData} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Schema Generator Modal */}
      {showSchemaGenerator && (
        <SchemaGenerator
          onGenerate={handleSchemaGenerated}
          onClose={()=> setShowSchemaGenerator(false)}
        />
      )}

      {/* Webshop Picker Modal */}
      {showWebshopPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Vælg Webshop</h3>
                <button
                  onClick={()=> setShowWebshopPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>
              <div className="grid gap-4">
                {webshops.map((webshop)=> (
                  <button
                    key={webshop.id}
                    onClick={()=> insertWebshopShortcode(webshop.id)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center p-2">
                      <img
                        src={webshop.logo_url}
                        alt={webshop.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e)=> {
                          e.target.style.display='none'
                          e.target.nextSibling.style.display='flex'
                        }}
                      />
                      <div className="hidden items-center justify-center w-full h-full bg-blue-100 text-blue-600 font-semibold text-sm">
                        {webshop.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{webshop.name}</h5>
                      <p className="text-sm text-gray-600 line-clamp-1">{webshop.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogManager
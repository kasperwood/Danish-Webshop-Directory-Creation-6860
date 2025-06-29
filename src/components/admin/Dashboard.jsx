import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const { FiShoppingBag, FiEye, FiMousePointer, FiTrendingUp, FiCalendar } = FiIcons

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWebshops: 0,
    totalViews: 0,
    totalClicks: 0,
    totalBlogPosts: 0
  })
  const [liveClicks, setLiveClicks] = useState([])
  const [topWebshops, setTopWebshops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()

    // Set up real-time subscription for live clicks
    const subscription = supabase
      .channel('dashboard_clicks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'webshop_clicks_dk847392' }, (payload) => {
        console.log('New click received on dashboard:', payload)
        setLiveClicks(prev => [payload.new, ...prev].slice(0, 10))
        setStats(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }))
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats - REAL DATA ONLY
      const [webshopsRes, viewsRes, clicksRes, blogRes] = await Promise.all([
        supabase.from('webshops_dk847392').select('id', { count: 'exact' }),
        supabase.from('page_views_dk847392').select('id', { count: 'exact' }),
        supabase.from('webshop_clicks_dk847392').select('id', { count: 'exact' }),
        supabase.from('blog_posts_dk847392').select('id', { count: 'exact' })
      ])

      setStats({
        totalWebshops: webshopsRes.count || 0,
        totalViews: viewsRes.count || 0,
        totalClicks: clicksRes.count || 0,
        totalBlogPosts: blogRes.count || 0
      })

      // Fetch top webshops by clicks - REAL DATA ONLY
      const { data: topShops } = await supabase
        .from('webshops_dk847392')
        .select('name, clicks_count, views_count')
        .order('clicks_count', { ascending: false })
        .limit(5)

      setTopWebshops(topShops || [])

      // Fetch recent live clicks (last 10) - REAL DATA ONLY
      const { data: clicks } = await supabase
        .from('webshop_clicks_dk847392')
        .select('webshop_name, created_at, referrer_page')
        .order('created_at', { ascending: false })
        .limit(10)

      setLiveClicks(clicks || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Webshops', value: stats.totalWebshops, icon: FiShoppingBag, color: 'from-blue-500 to-blue-600' },
    { title: 'Sidevisninger', value: stats.totalViews, icon: FiEye, color: 'from-green-500 to-green-600' },
    { title: 'Webshop Klik', value: stats.totalClicks, icon: FiMousePointer, color: 'from-purple-500 to-purple-600' },
    { title: 'Blog Artikler', value: stats.totalBlogPosts, icon: FiTrendingUp, color: 'from-orange-500 to-orange-600' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
              </div>
              <SafeIcon icon={stat.icon} className="w-8 h-8 text-white/80" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Webshops */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Webshops (Klik)
          </h3>
          <div className="space-y-3">
            {topWebshops.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Ingen webshops endnu...</p>
            ) : (
              topWebshops.map((shop, index) => (
                <div key={shop.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{shop.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{shop.clicks_count || 0} klik</div>
                    <div className="text-sm text-gray-500">{shop.views_count || 0} visninger</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Live Clicks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Live Kliks
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
              Live
            </span>
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {liveClicks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Ingen webshop klik endnu...</p>
            ) : (
              liveClicks.map((click, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center p-3 border-l-4 border-green-600 bg-green-50 rounded-r-lg"
                >
                  <SafeIcon icon={FiMousePointer} className="w-4 h-4 text-green-600 mr-3" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {click.webshop_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(click.created_at).toLocaleString('da-DK')}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hurtige Handlinger
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors">
            <SafeIcon icon={FiShoppingBag} className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Tilføj Webshop</div>
            <div className="text-sm text-gray-500">Registrer ny webshop</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors">
            <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Ny Blog Post</div>
            <div className="text-sm text-gray-500">Skriv ny artikel</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition-colors">
            <SafeIcon icon={FiEye} className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="font-medium text-gray-900">Se Analytics</div>
            <div className="text-sm text-gray-500">Detaljeret rapport</div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
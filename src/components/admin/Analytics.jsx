import React,{useState,useEffect} from 'react'
import {motion} from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import supabase from '../../lib/supabase'

const {FiCalendar,FiEye,FiMousePointer,FiTrendingUp,FiBarChart3,FiDownload,FiFilter,FiRefreshCw,FiTrash2}=FiIcons

const Analytics=()=> {
  const [startDate,setStartDate]=useState(()=> {
    const date=new Date()
    date.setDate(date.getDate() - 7)
    return date.toISOString().split('T')[0]
  })
  const [endDate,setEndDate]=useState(()=> {
    const date=new Date()
    return date.toISOString().split('T')[0]
  })
  const [analytics,setAnalytics]=useState({
    totalViews: 0,
    totalClicks: 0,
    topPages: [],
    topWebshops: [],
    liveClicks: [],
    clicksByDay: [],
    viewsByDay: []
  })
  const [loading,setLoading]=useState(true)
  const [resetting,setResetting]=useState(false)

  useEffect(()=> {
    fetchAnalytics()

    // Set up real-time subscription for live clicks
    const subscription=supabase
      .channel('webshop_clicks')
      .on('postgres_changes',{
        event: 'INSERT',
        schema: 'public',
        table: 'webshop_clicks_dk847392'
      },(payload)=> {
        console.log('New click received:',payload)
        setAnalytics(prev=> ({
          ...prev,
          liveClicks: [payload.new,...prev.liveClicks].slice(0,20),
          totalClicks: prev.totalClicks + 1
        }))
      })
      .subscribe()

    return ()=> {
      subscription.unsubscribe()
    }
  },[startDate,endDate])

  const fetchAnalytics=async ()=> {
    setLoading(true)
    try {
      const start=new Date(startDate + 'T00:00:00Z')
      const end=new Date(endDate + 'T23:59:59Z')

      // Fetch page views - REAL DATA ONLY
      const {data: pageViews,count: totalViews}=await supabase
        .from('page_views_dk847392')
        .select('*',{count: 'exact'})
        .gte('created_at',start.toISOString())
        .lte('created_at',end.toISOString())

      // Fetch webshop clicks - REAL DATA ONLY
      const {data: webshopClicks,count: totalClicks}=await supabase
        .from('webshop_clicks_dk847392')
        .select('*',{count: 'exact'})
        .gte('created_at',start.toISOString())
        .lte('created_at',end.toISOString())
        .order('created_at',{ascending: false})

      // Get top pages - REAL DATA ONLY
      const pageViewsCount={}
      pageViews?.forEach(view=> {
        const path=view.page_path
        pageViewsCount[path]=(pageViewsCount[path] || 0) + 1
      })

      const topPages=Object.entries(pageViewsCount)
        .sort(([,a],[,b])=> b - a)
        .slice(0,10)
        .map(([path,count])=> ({path,count}))

      // Get top webshops - REAL DATA ONLY
      const webshopClicksCount={}
      webshopClicks?.forEach(click=> {
        const name=click.webshop_name
        webshopClicksCount[name]=(webshopClicksCount[name] || 0) + 1
      })

      const topWebshops=Object.entries(webshopClicksCount)
        .sort(([,a],[,b])=> b - a)
        .slice(0,10)
        .map(([name,count])=> ({name,count}))

      // Get live clicks (last 20 clicks) - REAL DATA ONLY
      const liveClicks=webshopClicks?.slice(0,20) || []

      // Group views and clicks by day - REAL DATA ONLY
      const viewsByDay=groupByDay(pageViews || [],start,end)
      const clicksByDay=groupByDay(webshopClicks || [],start,end)

      setAnalytics({
        totalViews: totalViews || 0,
        totalClicks: totalClicks || 0,
        topPages,
        topWebshops,
        liveClicks,
        viewsByDay,
        clicksByDay
      })
    } catch (error) {
      console.error('Error fetching analytics:',error)
    } finally {
      setLoading(false)
    }
  }

  const groupByDay=(data,startDate,endDate)=> {
    const days={}
    const current=new Date(startDate)

    // Initialize all days with 0
    while (current <=endDate) {
      const dateStr=current.toISOString().split('T')[0]
      days[dateStr]=0
      current.setDate(current.getDate() + 1)
    }

    // Count actual data
    data.forEach(item=> {
      const dateStr=new Date(item.created_at).toISOString().split('T')[0]
      if (Object.prototype.hasOwnProperty.call(days,dateStr)) {
        days[dateStr]++
      }
    })

    return Object.entries(days).map(([date,count])=> ({date,count}))
  }

  const resetAnalytics=async ()=> {
    if (!confirm('Er du sikker på at du vil nulstille ALLE analytics data? Dette kan ikke fortrydes!')) {
      return
    }

    setResetting(true)
    try {
      // Delete all page views
      const {error: viewsError}=await supabase
        .from('page_views_dk847392')
        .delete()
        .neq('id','00000000-0000-0000-0000-000000000000') // Delete all rows

      // Delete all webshop clicks
      const {error: clicksError}=await supabase
        .from('webshop_clicks_dk847392')
        .delete()
        .neq('id','00000000-0000-0000-0000-000000000000') // Delete all rows

      if (viewsError) console.error('Error deleting page views:',viewsError)
      if (clicksError) console.error('Error deleting webshop clicks:',clicksError)

      // Reset analytics state
      setAnalytics({
        totalViews: 0,
        totalClicks: 0,
        topPages: [],
        topWebshops: [],
        liveClicks: [],
        clicksByDay: [],
        viewsByDay: []
      })

      alert('Analytics data blev nulstillet succesfuldt!')
    } catch (error) {
      console.error('Error resetting analytics:',error)
      alert('Fejl ved nulstilling af analytics data')
    } finally {
      setResetting(false)
    }
  }

  const exportData=()=> {
    if (analytics.topPages.length===0 && analytics.topWebshops.length===0) {
      alert('Ingen data at eksportere')
      return
    }

    const csvContent=[
      ['Type','Navn','Antal'],
      ...analytics.topPages.map(page=> ['Side',page.path,page.count]),
      ...analytics.topWebshops.map(shop=> ['Webshop',shop.name,shop.count])
    ].map(row=> row.join(',')).join('\n')

    const blob=new Blob([csvContent],{type: 'text/csv'})
    const url=window.URL.createObjectURL(blob)
    const a=document.createElement('a')
    a.href=url
    a.download=`analytics-${startDate}-to-${endDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Rigtige data - kun faktiske besøgende og klik</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetAnalytics}
            disabled={resetting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
          >
            <SafeIcon icon={resetting ? FiRefreshCw : FiTrash2} className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Nulstiller...' : 'Nulstil Alt Data'}
          </button>

          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={exportData}
            disabled={analytics.topPages.length===0 && analytics.topWebshops.length===0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            Eksporter
          </motion.button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Dato periode:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Fra:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e)=> setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Til:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e)=> setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            onClick={fetchAnalytics}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
            Opdater
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Sidevisninger</p>
              <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <SafeIcon icon={FiEye} className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{delay: 0.1}}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Webshop Klik</p>
              <p className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
            </div>
            <SafeIcon icon={FiMousePointer} className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{delay: 0.2}}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Gennemsnitlig CTR</p>
              <p className="text-2xl font-bold">
                {analytics.totalViews > 0 
                  ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1) + '%'
                  : '0%'
                }
              </p>
            </div>
            <SafeIcon icon={FiTrendingUp} className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{opacity: 0,y: 20}}
          animate={{opacity: 1,y: 0}}
          transition={{delay: 0.3}}
          className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Live Klik</p>
              <p className="text-2xl font-bold">{analytics.liveClicks.length}</p>
            </div>
            <SafeIcon icon={FiBarChart3} className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{opacity: 0,x: -20}}
          animate={{opacity: 1,x: 0}}
          transition={{delay: 0.4}}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SafeIcon icon={FiEye} className="w-5 h-5" />
            Top Sider
          </h3>
          <div className="space-y-3">
            {analytics.topPages.length===0 ? (
              <p className="text-gray-500 text-center py-8">Ingen sidevisninger endnu...</p>
            ) : (
              analytics.topPages.slice(0,8).map((page,index)=> (
                <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900 truncate">{page.path}</span>
                  </div>
                  <span className="text-blue-600 font-semibold">{page.count}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Webshops */}
        <motion.div
          initial={{opacity: 0,x: 20}}
          animate={{opacity: 1,x: 0}}
          transition={{delay: 0.5}}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SafeIcon icon={FiMousePointer} className="w-5 h-5" />
            Top Webshops (Klik)
          </h3>
          <div className="space-y-3">
            {analytics.topWebshops.length===0 ? (
              <p className="text-gray-500 text-center py-8">Ingen webshop klik endnu...</p>
            ) : (
              analytics.topWebshops.slice(0,8).map((shop,index)=> (
                <div key={shop.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">{shop.name}</span>
                  </div>
                  <span className="text-green-600 font-semibold">{shop.count}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Live Clicks */}
      <motion.div
        initial={{opacity: 0,y: 20}}
        animate={{opacity: 1,y: 0}}
        transition={{delay: 0.6}}
        className="bg-white rounded-xl shadow-sm p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <SafeIcon icon={FiMousePointer} className="w-5 h-5" />
          Live Kliks
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
            Live
          </span>
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {analytics.liveClicks.length===0 ? (
            <p className="text-gray-500 text-center py-8">Ingen webshop klik endnu...</p>
          ) : (
            analytics.liveClicks.map((click,index)=> (
              <motion.div
                key={click.id || index}
                initial={{opacity: 0,x: -20}}
                animate={{opacity: 1,x: 0}}
                className="flex items-start gap-3 p-3 border-l-4 border-green-600 bg-green-50 rounded-r-lg"
              >
                <SafeIcon icon={FiMousePointer} className="w-4 h-4 mt-1 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Klik på {click.webshop_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(click.created_at).toLocaleString('da-DK')}
                  </div>
                  {click.referrer_page && (
                    <div className="text-xs text-gray-400">
                      Fra: {click.referrer_page}
                    </div>
                  )}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics
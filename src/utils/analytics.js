import supabase from '../lib/supabase'

// Track page views
export const trackPageView = async (pagePath, pageTitle = null) => {
  try {
    const { error } = await supabase
      .from('page_views_dk847392')
      .insert([{
        page_path: pagePath,
        page_title: pageTitle,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        session_id: getSessionId()
      }])

    if (error) {
      console.error('Error tracking page view:', error)
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Track webshop clicks
export const trackWebshopClick = async (webshopName, webshopId = null) => {
  try {
    const { error } = await supabase
      .from('webshop_clicks_dk847392')
      .insert([{
        webshop_id: webshopId,
        webshop_name: webshopName,
        referrer_page: window.location.pathname,
        user_agent: navigator.userAgent,
        session_id: getSessionId()
      }])

    // Also increment the webshop's click count
    if (webshopId) {
      await supabase.rpc('increment_webshop_clicks', {
        webshop_slug: webshopName.toLowerCase().replace(/\s+/g, '-')
      })
    }

    if (error) {
      console.error('Error tracking webshop click:', error)
    }
  } catch (error) {
    console.error('Error tracking webshop click:', error)
  }
}

// Generate or get session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Initialize analytics tracking
export const initAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname, document.title)

  // Track page views on navigation (for SPA)
  let lastPath = window.location.pathname
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname
      trackPageView(window.location.pathname, document.title)
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })

  // Track page views on hash changes
  window.addEventListener('hashchange', () => {
    trackPageView(window.location.pathname + window.location.hash, document.title)
  })
}
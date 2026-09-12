// Google Analytics 4 integration.
//
// Everything here is inert unless VITE_GA_ID is set, which keeps dev servers
// and the test suite from sending hits to the live property.

let initialized = false

// For testing only: reset module-level state
export const __TEST__resetAnalytics = () => {
  initialized = false
}

export const isInitialized = () => initialized

export function initAnalytics() {
  if (initialized) return false

  const id = import.meta.env.VITE_GA_ID
  if (!id) return false

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // gtag relies on `arguments` being pushed verbatim, so no rest params here.
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  // Page views are sent by the router instead, so the initial load isn't
  // counted twice and SPA navigation is captured the same way.
  window.gtag('config', id, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id)
  document.head.appendChild(script)

  initialized = true
  return true
}

export function trackEvent(name, params = {}) {
  if (!initialized || typeof window.gtag !== 'function') return false
  window.gtag('event', name, params)
  return true
}

export function trackPageView({ path, title, location }) {
  return trackEvent('page_view', {
    page_path: path,
    page_title: title,
    page_location: location,
  })
}

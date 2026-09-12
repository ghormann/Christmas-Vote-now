import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  initAnalytics,
  trackEvent,
  trackPageView,
  isInitialized,
  __TEST__resetAnalytics,
} from '@/analytics'

const GA_ID = 'G-TESTID1234'

const gaScripts = () =>
  Array.from(document.head.querySelectorAll('script')).filter((s) =>
    s.src.includes('googletagmanager.com/gtag/js'),
  )

describe('analytics', () => {
  beforeEach(() => {
    __TEST__resetAnalytics()
    delete window.gtag
    delete window.dataLayer
    document.head.querySelectorAll('script').forEach((s) => s.remove())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('when VITE_GA_ID is not set', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_GA_ID', '')
    })

    it('does not initialize', () => {
      expect(initAnalytics()).toBe(false)
      expect(isInitialized()).toBe(false)
    })

    it('injects no script tag', () => {
      initAnalytics()
      expect(gaScripts()).toHaveLength(0)
    })

    it('makes trackEvent a no-op', () => {
      initAnalytics()
      expect(trackEvent('song_vote', { song_id: 1 })).toBe(false)
      expect(window.dataLayer).toBeUndefined()
    })
  })

  describe('when VITE_GA_ID is set', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_GA_ID', GA_ID)
    })

    it('initializes once', () => {
      expect(initAnalytics()).toBe(true)
      expect(isInitialized()).toBe(true)
      expect(initAnalytics()).toBe(false)
    })

    it('injects the gtag script exactly once', () => {
      initAnalytics()
      initAnalytics()
      const scripts = gaScripts()
      expect(scripts).toHaveLength(1)
      expect(scripts[0].src).toContain(GA_ID)
      expect(scripts[0].async).toBe(true)
    })

    it('disables automatic page views so the router is the only source', () => {
      initAnalytics()
      const config = Array.from(window.dataLayer).find((args) => args[0] === 'config')
      expect(config[1]).toBe(GA_ID)
      expect(config[2]).toEqual({ send_page_view: false })
    })

    it('pushes events with their params', () => {
      initAnalytics()
      expect(trackEvent('song_vote', { song_id: 7, song_title: 'Sleigh Ride' })).toBe(true)
      const event = Array.from(window.dataLayer).find((args) => args[0] === 'event')
      expect(event[1]).toBe('song_vote')
      expect(event[2]).toEqual({ song_id: 7, song_title: 'Sleigh Ride' })
    })

    it('sends page views as page_view events', () => {
      initAnalytics()
      trackPageView({ path: '/stats', title: 'Stats', location: 'http://x/stats' })
      const event = Array.from(window.dataLayer).find((args) => args[0] === 'event')
      expect(event[1]).toBe('page_view')
      expect(event[2]).toEqual({
        page_path: '/stats',
        page_title: 'Stats',
        page_location: 'http://x/stats',
      })
    })
  })
})

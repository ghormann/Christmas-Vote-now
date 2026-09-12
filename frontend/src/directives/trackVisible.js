import { trackEvent } from '@/analytics'

// Fires `stat_section_view` once when an element has been at least half
// visible for DWELL_MS. The dwell requirement is what keeps a fast scroll
// past a section from counting as somebody having read it.
const VISIBLE_RATIO = 0.5
const DWELL_MS = 1000

const state = new WeakMap()

const clearTimer = (el) => {
  const entry = state.get(el)
  if (entry && entry.timer) {
    clearTimeout(entry.timer)
    entry.timer = null
  }
}

export const trackVisible = {
  mounted(el, binding) {
    const section = binding.value
    if (!section) return

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const current = state.get(el)
            // `fired` guards against an entry still queued when we unobserve.
            if (!current || current.fired || current.timer) continue
            current.timer = setTimeout(() => {
              current.fired = true
              trackEvent('stat_section_view', { section })
              // At most once per page visit.
              observer.unobserve(el)
              current.timer = null
            }, DWELL_MS)
          } else {
            clearTimer(el)
          }
        }
      },
      { threshold: VISIBLE_RATIO },
    )

    state.set(el, { observer, timer: null, fired: false })
    observer.observe(el)
  },

  unmounted(el) {
    const entry = state.get(el)
    if (!entry) return
    clearTimer(el)
    entry.observer.disconnect()
    state.delete(el)
  },
}

export default trackVisible

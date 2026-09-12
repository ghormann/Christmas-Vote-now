import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { trackVisible } from '@/directives/trackVisible'
import { trackEvent } from '@/analytics'

vi.mock('@/analytics', () => ({
  trackEvent: vi.fn(),
}))

// Captured per-instance so a test can drive intersection by hand.
let observers = []

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.observed = []
    this.unobserved = []
    this.disconnected = false
    observers.push(this)
  }
  observe(el) {
    this.observed.push(el)
  }
  unobserve(el) {
    this.unobserved.push(el)
  }
  disconnect() {
    this.disconnected = true
  }
  enter() {
    this.callback([{ isIntersecting: true, target: this.observed[0] }])
  }
  leave() {
    this.callback([{ isIntersecting: false, target: this.observed[0] }])
  }
}

const mountSection = (section = 'VotedSongs') =>
  mount(
    { template: `<div v-track-visible="section"></div>`, props: ['section'] },
    { props: { section }, global: { directives: { 'track-visible': trackVisible } } },
  )

describe('v-track-visible', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    observers = []
    vi.mocked(trackEvent).mockClear()
    window.IntersectionObserver = MockIntersectionObserver
    global.IntersectionObserver = MockIntersectionObserver
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('observes the element at a 50% threshold', () => {
    const wrapper = mountSection()
    expect(observers).toHaveLength(1)
    expect(observers[0].options.threshold).toBe(0.5)
    expect(observers[0].observed[0]).toBe(wrapper.element)
  })

  it('does not fire on intersection alone', () => {
    mountSection()
    observers[0].enter()
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('fires stat_section_view after the dwell time', () => {
    mountSection('MaxCars')
    observers[0].enter()
    vi.advanceTimersByTime(1000)
    expect(trackEvent).toHaveBeenCalledWith('stat_section_view', { section: 'MaxCars' })
  })

  it('does not fire when scrolled past before the dwell time', () => {
    mountSection()
    observers[0].enter()
    vi.advanceTimersByTime(400)
    observers[0].leave()
    vi.advanceTimersByTime(5000)
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('fires at most once per visit', () => {
    mountSection()
    observers[0].enter()
    vi.advanceTimersByTime(1000)
    expect(observers[0].unobserved).toHaveLength(1)
    observers[0].enter()
    vi.advanceTimersByTime(5000)
    expect(trackEvent).toHaveBeenCalledTimes(1)
  })

  it('disconnects the observer when unmounted', () => {
    const wrapper = mountSection()
    wrapper.unmount()
    expect(observers[0].disconnected).toBe(true)
  })

  it('does nothing without a section name', () => {
    mount(
      { template: `<div v-track-visible=""></div>` },
      { global: { directives: { 'track-visible': trackVisible } } },
    )
    expect(observers).toHaveLength(0)
  })
})

import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 8, status: 'OK', snowmanId: -1 },
        model: {
          songs: [],
          snowmenQueue: [],
          nameQueue: [],
          current: { status: 'idle', enabled: true, nameStatus: '', secondsTotal: -1, secondsRemaining: -1, isDisplayHours: false, isShortList: false, title: '' },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {},
          powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
    post: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 7, status: 'OK', snowmanId: -1 },
        model: {
          songs: [], snowmenQueue: [], nameQueue: [],
          current: { status: 'idle', enabled: true, nameStatus: '', secondsTotal: -1, secondsRemaining: -1, isDisplayHours: false, isShortList: false, title: '' },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {}, powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
    delete: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 9, status: 'OK', snowmanId: -1 },
        model: {
          songs: [], snowmenQueue: [], nameQueue: [],
          current: { status: 'idle', enabled: true, nameStatus: '', secondsTotal: -1, secondsRemaining: -1, isDisplayHours: false, isShortList: false, title: '' },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {}, powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
  },
}))

vi.mock('@hapi/nes/lib/client', () => {
  let instance
  const makeInstance = () => ({
    connect: vi.fn().mockResolvedValue(undefined),
    onConnect: null,
    onDisconnect: null,
    onUpdate: null,
  })
  const ClientMock = vi.fn(function MockClient(url) {
    instance = makeInstance()
    return instance
  })
  ClientMock.getInstance = () => instance
  ClientMock.makeInstance = makeInstance
  return { default: { Client: ClientMock } }
})

import axios from 'axios'
import Nes from '@hapi/nes/lib/client'
import { displayStore } from '../display'

describe('displayStore - URL configuration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('fetchState calls the API base URL from env', async () => {
    const store = displayStore()
    await store.fetchState()
    expect(axios.get).toHaveBeenCalledWith(import.meta.env.VITE_API_BASE_URL + '/queue')
  })

  it('addVote calls the API base URL from env', async () => {
    const store = displayStore()
    await store.addVote(42)
    expect(axios.post).toHaveBeenCalledWith(import.meta.env.VITE_API_BASE_URL + '/vote/42')
  })

  it('removeVote calls the API base URL from env', async () => {
    const store = displayStore()
    await store.removeVote(42)
    expect(axios.delete).toHaveBeenCalledWith(import.meta.env.VITE_API_BASE_URL + '/vote/42')
  })

  it('addSnowmanVote calls the API base URL from env', async () => {
    const store = displayStore()
    await store.addSnowmanVote(3)
    expect(axios.post).toHaveBeenCalledWith(import.meta.env.VITE_API_BASE_URL + '/votesnowman/3')
  })

  it('initWS connects to the WS URL from env', async () => {
    const store = displayStore()
    await store.initWS()
    expect(Nes.Client).toHaveBeenCalledWith(import.meta.env.VITE_WS_URL)
  })
})

describe('displayStore - connection state machine', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
    Nes.Client.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    // Clean up any running poll intervals
    const store = displayStore()
    store.stopFallbackPoll()
  })

  it('wsConnected starts as false', () => {
    const store = displayStore()
    expect(store.wsConnected).toBe(false)
  })

  it('startFallbackPoll starts a 10-second interval', () => {
    const store = displayStore()
    const spy = vi.spyOn(global, 'setInterval')
    store.startFallbackPoll()
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 10000)
  })

  it('startFallbackPoll does not start a second interval if already running', () => {
    const store = displayStore()
    const spy = vi.spyOn(global, 'setInterval')
    store.startFallbackPoll()
    store.startFallbackPoll()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('stopFallbackPoll clears a running interval', () => {
    const store = displayStore()
    const spy = vi.spyOn(global, 'clearInterval')
    store.startFallbackPoll()
    store.stopFallbackPoll()
    expect(spy).toHaveBeenCalled()
  })

  it('onConnect handler sets wsConnected to true and stops poll', async () => {
    const store = displayStore()
    const stopSpy = vi.spyOn(store, 'stopFallbackPoll')
    await store.initWS()
    const client = Nes.Client.getInstance()
    client.onConnect()
    expect(store.wsConnected).toBe(true)
    expect(stopSpy).toHaveBeenCalled()
  })

  it('onDisconnect handler sets wsConnected to false', async () => {
    const store = displayStore()
    await store.initWS()
    const client = Nes.Client.getInstance()
    client.onConnect()
    client.onDisconnect()
    expect(store.wsConnected).toBe(false)
  })

  it('onDisconnect starts fallback poll after 10 seconds if still disconnected', async () => {
    const store = displayStore()
    const startSpy = vi.spyOn(store, 'startFallbackPoll')
    await store.initWS()
    const client = Nes.Client.getInstance()
    client.onDisconnect()
    vi.advanceTimersByTime(10000)
    expect(startSpy).toHaveBeenCalled()
  })

  it('fallback poll does not start if WebSocket reconnects within 10 seconds', async () => {
    const store = displayStore()
    const startSpy = vi.spyOn(store, 'startFallbackPoll')
    await store.initWS()
    const client = Nes.Client.getInstance()
    client.onDisconnect()
    // Reconnect before the 10-second timeout fires
    client.onConnect()
    vi.advanceTimersByTime(10000)
    expect(startSpy).not.toHaveBeenCalled()
  })

  it('starts fallback poll immediately if initial connect throws', async () => {
    const store = displayStore()
    const startSpy = vi.spyOn(store, 'startFallbackPoll')
    // Make connect fail on the next call only
    Nes.Client.mockImplementationOnce(function MockFailClient(url) {
      return {
        connect: vi.fn().mockRejectedValue(new Error('connection refused')),
        onConnect: null,
        onDisconnect: null,
        onUpdate: null,
      }
    })
    await store.initWS()
    expect(startSpy).toHaveBeenCalled()
  })
})

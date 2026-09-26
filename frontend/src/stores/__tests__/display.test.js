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
          current: {
            status: 'idle',
            enabled: true,
            nameStatus: '',
            secondsTotal: -1,
            secondsRemaining: -1,
            isDisplayHours: false,
            isShortList: false,
            title: '',
          },
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
          songs: [],
          snowmenQueue: [],
          nameQueue: [],
          current: {
            status: 'idle',
            enabled: true,
            nameStatus: '',
            secondsTotal: -1,
            secondsRemaining: -1,
            isDisplayHours: false,
            isShortList: false,
            title: '',
          },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {},
          powerStats: { kwh: 0, dollars: 0 },
          nameEstimates: { estimated_seconds: 0, message: '' },
        },
      },
    }),
    delete: vi.fn().mockResolvedValue({
      data: {
        votesRemaining: { remaining: 9, status: 'OK', snowmanId: -1 },
        model: {
          songs: [],
          snowmenQueue: [],
          nameQueue: [],
          current: {
            status: 'idle',
            enabled: true,
            nameStatus: '',
            secondsTotal: -1,
            secondsRemaining: -1,
            isDisplayHours: false,
            isShortList: false,
            title: '',
          },
          health: { lastStats: new Date().toISOString(), status: 'OK' },
          stats: {},
          powerStats: { kwh: 0, dollars: 0 },
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

vi.mock('@/analytics', () => ({
  trackEvent: vi.fn(),
}))

import axios from 'axios'
import Nes from '@hapi/nes/lib/client'
import { trackEvent } from '@/analytics'
import { displayStore, __TEST__resetWSState } from '../display'

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
    // Reset module-level state for a clean test
    __TEST__resetWSState()
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    const store = displayStore()
    store.stopFallbackPoll()
    vi.useRealTimers()
    vi.clearAllMocks()
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

  it('startFallbackPoll calls fetchState immediately', async () => {
    const store = displayStore()
    const fetchSpy = vi.spyOn(store, 'fetchState').mockResolvedValue(undefined)
    store.startFallbackPoll()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})

describe('displayStore - analytics events', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const seedSongs = (store) => {
    store.availSongs = [{ id: 42, title: 'Sleigh Ride', votes: 20, duration: 120 }]
  }

  it('addVote sends song_vote with the resolved title and remaining votes', async () => {
    const store = displayStore()
    seedSongs(store)
    await store.addVote(42)
    expect(trackEvent).toHaveBeenCalledWith('song_vote', {
      song_id: 42,
      song_title: 'Sleigh Ride',
      votes_remaining: 7,
    })
  })

  it('addVote resolves the title before the response replaces availSongs', async () => {
    const store = displayStore()
    seedSongs(store)
    await store.addVote(42)
    // The mocked response sets songs: [], so a title read afterwards is lost.
    expect(trackEvent.mock.calls[0][1].song_title).toBe('Sleigh Ride')
  })

  it('addVote falls back to unknown for an unrecognized id', async () => {
    const store = displayStore()
    seedSongs(store)
    await store.addVote(999)
    expect(trackEvent).toHaveBeenCalledWith(
      'song_vote',
      expect.objectContaining({ song_id: 999, song_title: 'unknown' }),
    )
  })

  it('removeVote sends song_vote_removed', async () => {
    const store = displayStore()
    seedSongs(store)
    await store.removeVote(42)
    expect(trackEvent).toHaveBeenCalledWith('song_vote_removed', {
      song_id: 42,
      song_title: 'Sleigh Ride',
    })
  })

  it('addSnowmanVote sends snowman_vote', async () => {
    const store = displayStore()
    await store.addSnowmanVote(3)
    expect(trackEvent).toHaveBeenCalledWith('snowman_vote', { snowman_id: 3 })
  })

  it('sends nothing when the vote request fails', async () => {
    const store = displayStore()
    seedSongs(store)
    axios.post.mockRejectedValueOnce(new Error('boom'))
    await expect(store.addVote(42)).rejects.toThrow('boom')
    expect(trackEvent).not.toHaveBeenCalled()
  })

  it('fetchState sends no events', async () => {
    const store = displayStore()
    await store.fetchState()
    expect(trackEvent).not.toHaveBeenCalled()
  })
})

describe('displayStore - my votes', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const withHistory = (history) => ({
    remaining: 8 - history.length,
    status: 'OK',
    snowmanId: -1,
    history,
  })

  it('myVotesFor counts how many of my votes are on each song', () => {
    const store = displayStore()
    store.setSongs({ votesRemaining: withHistory([42, 7, 42]) })
    expect(store.myVotesFor(42)).toBe(2)
    expect(store.myVotesFor(7)).toBe(1)
    expect(store.myVotesFor(99)).toBe(0)
  })

  it('treats a missing history as no votes', () => {
    const store = displayStore()
    store.setSongs({ votesRemaining: { remaining: 8, status: 'OK', snowmanId: -1 } })
    expect(store.myVotesFor(42)).toBe(0)
  })

  it('refetches my votes when a song I voted for has just been played', () => {
    const store = displayStore()
    const fetchSpy = vi.spyOn(store, 'fetchState').mockResolvedValue(undefined)
    store.setSongs({ votesRemaining: withHistory([42]) })
    // The server drops a played song to 7 votes and hands the votes back.
    store.setPublic({
      songs: [{ id: 42, title: 'Sleigh Ride', votes: 7, duration: 120 }],
      health: { lastStats: new Date().toISOString() },
      stats: {},
      powerStats: { kwh: 0, dollars: 0 },
    })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('does not refetch while my voted songs are still available', () => {
    const store = displayStore()
    const fetchSpy = vi.spyOn(store, 'fetchState').mockResolvedValue(undefined)
    store.setSongs({ votesRemaining: withHistory([42]) })
    store.setPublic({
      songs: [{ id: 42, title: 'Sleigh Ride', votes: 30, duration: 120 }],
      health: { lastStats: new Date().toISOString() },
      stats: {},
      powerStats: { kwh: 0, dollars: 0 },
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

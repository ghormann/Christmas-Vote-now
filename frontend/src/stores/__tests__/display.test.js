import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

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
  class MockClient {
    constructor(url) {
      instance = { connect: vi.fn().mockResolvedValue(undefined), onConnect: null, onDisconnect: null, onUpdate: null }
      return instance
    }
    static getInstance() {
      return instance
    }
  }
  return { default: { Client: vi.fn(MockClient) } }
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

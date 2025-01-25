import { defineStore } from 'pinia'
import axios from 'axios'
import moment from 'moment'
import Nes from '@hapi/nes/lib/client'

const SONG_RECENT_CUTOFF = 17

var client = undefined

export const displayStore = defineStore('displayStore', {
  state: () => ({
    availSongs: [
      {
        id: 1,
        title: 'Loading.....',
        votes: 0,
      },
    ],
    nameQueue: [
      {
        id: 1,
        name: 'Greg',
      },
      {
        id: 2,
        name: 'Matt',
      },
    ],
    totalDurationMin: -1,
    snowmenQueue: [],
    mySelectedSnowmen: -1,
    healthData: {
      idleDate: '2019-10-12T15:35:33.339Z',
      lastFppDate: '2019-10-12T15:35:33.339Z',
      lastNameMqtt: '2019-10-12T15:35:32.983Z',
      lastnameGenereate: '2019-10-12T15:34:15.796Z',
      lastnamePlay: '2019-10-12T15:34:15.796Z',
      status: 'ALL_OK',
    },
    nameEstimateData: { estimated_seconds: 468, message: 'Booting Up' },
    statsData: {
      total_buttons: 0,
      total_phones: 0,
      pNames_1hr: [],
      topNames_24hr: [],
      topNames_year: [],
      topSongs_1hr: [],
      topSongs_24hr: [],
      topSongs_year: [],
      topPlayedSongs_1hr: [],
      topPlayedSongs_24hr: [],
      topPlayedSongs_year: [],
      totalPower_year: {
        kwh: 0,
        dollars: 0,
      },
    },
    powerStatsData: {
      hours: 23.245833333333334,
      avgWatt: 266.26108066633293,
      kwh: 6.189460704322797,
      dollars: 0.5322936205717604,
      cnt: 83685,
    },
    current: {
      status: 'idle',
      enabled: true,
      nameStatus: 'Loading',
      secondsTotal: -1,
      secondsRemaining: -1,
      isDisplayHours: false,
      isShortList: false,
      title: '',
    },
    lastMessageReceived: 'OK',
    MyVotesRemaining: 8,
    lastUpdatedInfoDT: 'Never',
    lastUpdatedTS: 'Never',
  }),
  getters: {
    allAvailSongs: (state) => state.availSongs.filter((s) => s.votes >= SONG_RECENT_CUTOFF),
    availSongCount: (state) => state.availSongs.length,
    totalDurationMinutes: (state) => state.totalDurationMin,
    allOldSongs: (state) =>
      state.availSongs.filter((s) => s.votes < SONG_RECENT_CUTOFF && s.votes > -100),
    allDisabledSongs: (state) => state.availSongs.filter((s) => s.votes < -100),
    allNames: (state) => state.nameQueue,
    allSnowmen: (state) => state.snowmenQueue,
    currentSong: (state) => state.current,
    votesRemaining: (state) => state.MyVotesRemaining,
    mySnowmen: (state) => state.mySelectedSnowmen,
    lastMessage: (state) => state.lastMessageReceived,
    lastUpdated: (state) => state.lastUpdatedInfoDT,
    lastUpdatedTime: (state) => state.lastUpdatedTS,
    stats: (state) => state.statsData,
    powerStats: (state) => state.powerStatsData,
    lastStats: (state) => state.health.lastStatsTime,
    health: (state) => state.healthData,
    nameEstimates: (state) => state.nameEstimateData,
    numberOfYears: () => new Date().getFullYear() - 2000,
  },
  actions: {
    async initWS() {
      console.log('Calling initWS')
      client = new Nes.Client('wss://vote-now.org/ws')
      client.onConnect = () => {
        console.log('Connected')
        //clientConnected = true;
      }

      client.onDisconnect = () => {
        console.log('Disconnected')
        //clientConnected = false;
      }

      await client.connect()

      client.onUpdate = (update) => {
        this.setPublic(update)
      }
    },

    setSongs(input) {
      this.MyVotesRemaining = input.votesRemaining.remaining
      this.lastMessageReceived = input.votesRemaining.status
      this.mySelectedSnowmen = input.votesRemaining.snowmanId
    },

    setPublic(input) {
      this.availSongs = input.songs
      this.snowmenQueue = input.snowmenQueue
      this.nameQueue = input.nameQueue
      this.current = input.current
      this.healthData = input.health
      this.statsData = input.stats
      this.powerStatsData = input.powerStats
      this.nameEstimateData = input.nameEstimates
      this.lastUpdatedInfoDT = new Date()
      this.lastUpdatedTS = moment().format('LTS')
      this.healthData.lastStatsTime = moment(input.health.lastStats).format('LTS')

      // Total button presses
      this.statsData.total_buttons = 0
      if ('topButton_year' in this.stats) {
        for (const b of this.statsData['topButton_year']) {
          this.statsData.total_buttons += b['cnt']
        }
      }

      this.statsData.total_phones = 0
      if ('topPhones' in this.statsData) {
        for (const phone of this.statsData['topPhones']) {
          // it is always the last one, so this trick works.
          this.statsData.total_phones = phone['cnt']
        }
      }

      // Fix formatting
      this.powerStatsData.kwh = Math.round(this.powerStatsData.kwh * 100) / 100
      this.powerStatsData.dollars = Math.round(this.powerStatsData.dollars * 100) / 100

      var minutes = 0
      for (const song of this.availSongs) {
        minutes += song.duration
      }
      minutes = Math.round(minutes / 60)
      this.totalDurationMin = minutes
    },

    async fetchState() {
      let r = await axios.get('https://vote-now.org/api/queue')

      //let r = await axios.get('http://localhossetSongst:7654/queue');
      this.setSongs(r.data)
      this.setPublic(r.data.model)
    },
    async addVote(id) {
      let r = await axios.post('https://vote-now.org/api/vote/' + id)
      //let r = await axios.get('http://localhost:7654/vote/' + id);
      this.setSongs(r.data)
      this.setPublic(r.data.model)
    },
    async addSnowmanVote(id) {
      let r = await axios.post('https://vote-now.org/api/votesnowman/' + id)
      //let r = await axios.get('http://localhost:7654/votesnowman/' + id);
      this.setSongs(r.data)
      this.setPublic(r.data.model)
    },
    async removeVote(id) {
      let r = await axios.delete('https://vote-now.org/api/vote/' + id)
      //let r = await axios.delete('http://localhost:7654/vote/' + id);
      this.setSongs(r.data)
      this.setPublic(r.data.model)
    },
  },
})

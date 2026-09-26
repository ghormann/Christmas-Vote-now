import { defineStore } from 'pinia'
import axios from 'axios'

// Season dates, show hours and display size from GET /facts (server/data/facts.js),
// the same source that fills in the FAQ answers.
export const factsStore = defineStore('facts', {
  state: () => ({
    facts: {
      seasonYear: null,
      years: null,
      inSeason: true,
      openText: '',
      closeText: '',
      showHours: '5:00 PM to 11:00 PM',
      pixelCount: null,
      fm: '106.7 FM',
    },
    loaded: false,
  }),
  actions: {
    async fetchFacts() {
      if (this.loaded) return
      try {
        const r = await axios.get(import.meta.env.VITE_API_BASE_URL + '/facts')
        this.facts = r.data.facts
        this.loaded = true
      } catch (e) {
        console.log('Unable to load facts', e)
      }
    },
  },
})

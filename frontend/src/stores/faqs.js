import { defineStore } from 'pinia'
import axios from 'axios'

// The FAQ text lives on the server (server/data/faqs.js) so that this page and
// thehormanns.net show the same answers. Answers arrive as HTML with every
// date, song count and address already filled in.
export const faqStore = defineStore('faqs', {
  state: () => ({
    faq: [],
    loaded: false,
  }),
  getters: { allFaqs: (state) => state.faq },
  actions: {
    async fetchFaqs() {
      if (this.loaded) return
      try {
        const r = await axios.get(import.meta.env.VITE_API_BASE_URL + '/faq', {
          params: { audience: 'app' },
        })
        this.faq = r.data.faqs
        this.loaded = true
      } catch (e) {
        console.log('Unable to load FAQs', e)
      }
    },
  },
})

import { defineStore } from 'pinia'
import axios from 'axios'

export const otherDisplayStore = defineStore('otherDisplays', {
  state: () => ({
    displayData: [
      {
        displayid: 209,
        title: 'Wood Designs by Josh',
        myweight: 12,
        weight: 22,
        city: 'West Chester Township',
        state: 'OH',
        active: 'Y',
        musical: false,
        zip: 45069,
        ldate: 1734115731,
        url: 'https://cooldisplays.net/index.php?page=single&id=209',
        distance: 4.5735641791639,
        tags: ['Christmas', 'Ohio'],
      },
      {
        displayid: 121,
        title: '1050 Gail Avenue',
        myweight: 10,
        weight: 25,
        musical: false,
        city: 'Fairfield',
        state: 'OH',
        active: 'Y',
        zip: 45014,
        ldate: 1733668120,
        url: 'https://cooldisplays.net/index.php?page=single&id=121',
        distance: 8.414034775098,
        tags: ['Christmas', 'Ohio'],
      },
    ],
  }),
  getters: {
    otherDisplays: (state) => state.displayData,
    otherDisplayCount: (state) => state.displayData.length,
  },
  actions: {
    async fetchOtherDisplays() {
      let rc = await axios.get(
        'https://cooldisplays.net/favoriteJson.php?u=4bc62e8f4304ef2058dd7bc867a38d55i85i3863e180845856d92dfbe72016bbbb2cab68f9b8&lat=39.3953295&lng=-84.3991711',
      )
      const newdata = rc.data.displays
      newdata.forEach((o) => {
        o.musical = o.tags.includes('Synced to Music')
        o.distance = Math.round(o.distance * 100) / 100
        o.pict =
          'https://cooldisplays.net/picture.php?v=1608653961&width=300&display=' + o.displayid
      })
      this.displayData = newdata
    },
  },
})

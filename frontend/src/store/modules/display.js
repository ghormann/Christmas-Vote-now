//import axios from 'axios';

const state = {
  availSongs: [
    {
      id: 1,
      title: "This is a really really long song title ",
      votes: 3
    },
    {
      id: 2,
      title: "Song 2",
      votes: 0
    }
  ],
  previous: [
    {
      id: 3,
      title: "Old song"
    },
    {
      id: 4,
      title: "Another old song"
    }
  ]
};

const getters = {
  allAvailSongs: state => state.availSongs
};

const actions = {};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations
};

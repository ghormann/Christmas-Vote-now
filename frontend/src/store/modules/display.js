import axios from 'axios';

// Video on how to use Vue state: https://www.youtube.com/watch?v=5lVQgZzLMHc

const state = {
  availSongs: [
    {
      id: 1,
      title: "Loading.....",
      votes: 0
    }
  ],
  oldSongs: [
    {
      id: 3,
      title: "Loading"
    }
  ], 
  nameQueue: [
    {
      id: 1,
      name: "Greg"
    },
    {
      id: 2,
      name: "Matt"
    }
  ],
  votesRemaining: 8
};

const getters = {
  allAvailSongs: state => state.availSongs,
  allOldSongs: state => state.oldSongs,
  allNames: state => state.nameQueue,
  votesRemaining: state => state.votesRemaining
};

const actions = {
  async fetchState({ commit }) {
    let r = await axios.get('https://vote-now.org/api/queue');
    commit('setSongs', r.data);
  },
  async addVote({ commit }, id) {
    let r = await axios.post('https://vote-now.org/api/vote/' + id);
    commit('setSongs', r.data);
  }
};

const mutations = {
  setSongs: (state,input) => {
    state.availSongs = input.model.songs;
    state.oldSongs = input.model.oldSongs;
    state.votesRemaining = input.votesRemaining;
    state.nameQueue = input.model.nameQueue;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

import axios from "axios";
const moment = require("moment");
const Nes = require("@hapi/nes/lib/client");
var client = undefined;
//var clientConnected = false;

// Video on how to use Vue state: https://www.youtube.com/watch?v=5lVQgZzLMHc

const state = {
  availSongs: [
    {
      id: 1,
      title: "Loading.....",
      votes: 0
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
  current: {
    status: "idle",
    secondsTotal: -1,
    secondsRemaining: -1,
    isDisplayHours: false,
    title: ""
  },
  lastMessage: "OK",
  votesRemaining: 8,
  lastUpdated: "Never",
  lastUpdatedTime: "Never"
};

const getters = {
  allAvailSongs: state => state.availSongs.filter(s => s.votes >= 10),
  allOldSongs: state => state.availSongs.filter(s => s.votes < 10),
  allNames: state => state.nameQueue,
  currentSong: state => state.current,
  votesRemaining: state => state.votesRemaining,
  lastMessage: state => state.lastMessage,
  lastUpdated: state => state.lastUpdated,
  lastUpdatedTime: state => state.lastUpdatedTime
};

const actions = {
  async initWS({ commit }) {
    client = new Nes.Client("wss://vote-now.org/ws");
    client.onConnect = () => {
      // eslint-disable-next-line
      console.log("Connected");
      //clientConnected = true;
    };

    client.onDisconnect = () => {
      // eslint-disable-next-line
      console.log("Disconnected");
      //clientConnected = false;
    };

    await client.connect();

    client.onUpdate = update => {
      commit("setPublic", update);
    };
  },
  async fetchState({ commit }) {
    let r = await axios.get("https://vote-now.org/api/queue");
    //let r = await axios.get('http://localhost:7654/queue');
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  },
  async addVote({ commit }, id) {
    let r = await axios.post("https://vote-now.org/api/vote/" + id);
    //let r = await axios.get('http://localhost:7654/vote/' + id);
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  },
  async removeVote({ commit }, id) {
    let r = await axios.delete("https://vote-now.org/api/vote/" + id);
    //let r = await axios.delete('http://localhost:7654/vote/' + id);
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  }
};

const mutations = {
  setPublic: (state, input) => {
    state.availSongs = input.songs;
    state.oldSongs = input.oldSongs;
    state.nameQueue = input.nameQueue;
    state.current = input.current;
    state.lastUpdated = new Date();
    state.lastUpdatedTime = moment().format("LTS");
  },
  setSongs: (state, input) => {
    state.votesRemaining = input.votesRemaining.remaining;
    state.lastMessage = input.votesRemaining.status;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};

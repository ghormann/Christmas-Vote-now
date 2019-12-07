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
  health: {
    "idleDate":"2019-10-12T15:35:33.339Z",
    "lastFppDate":"2019-10-12T15:35:33.339Z",
    "lastNameMqtt":"2019-10-12T15:35:32.983Z",
    "lastnameGenereate":"2019-10-12T15:34:15.796Z",
    "lastnamePlay":"2019-10-12T15:34:15.796Z",
    "status":"ALL_OK"
  },
  stats: {
    pNames_1hr: [],
    topNames_24hr: [],
    topNames_year: [],
    topSongs_1hr: [],
    topSongs_24hr: [],
    topSongs_year: [],
    topPlayedSongs_1hr: [],
    topPlayedSongs_24hr: [],
    topPlayedSongs_year: []
  },
  current: {
    status: "idle",
    enabled: true,
    secondsTotal: -1,
    secondsRemaining: -1,
    isDisplayHours: false,
    isShortList: false,
    title: ""
  },
  lastMessage: "OK",
  votesRemaining: 8,
  lastUpdated: "Never",
  lastUpdatedTime: "Never"
};

const getters = {
  allAvailSongs: state => state.availSongs.filter(s => s.votes >= 10),
  allOldSongs: state => state.availSongs.filter(s => (s.votes < 10 && s.votes > -100)),
  allDisabledSongs: state => state.availSongs.filter(s => (s.votes < -100)),
  allNames: state => state.nameQueue,
  currentSong: state => state.current,
  votesRemaining: state => state.votesRemaining,
  lastMessage: state => state.lastMessage,
  lastUpdated: state => state.lastUpdated,
  lastUpdatedTime: state => state.lastUpdatedTime,
  stats: state => state.stats,
  lastStats: state => state.lastStats,
  health: state => state.health
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
    state.health = input.health;
    state.stats = input.stats;
    state.lastUpdated = new Date();
    state.lastUpdatedTime = moment().format("LTS");
    state.health.lastStatsTime = moment(input.health.lastStats).format("LTS");
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

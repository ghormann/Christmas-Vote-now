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
      votes: 0,
    },
  ],
  nameQueue: [
    {
      id: 1,
      name: "Greg",
    },
    {
      id: 2,
      name: "Matt",
    },
  ],
  totalDurationMinutes: -1,
  snowmenQueue: [],
  mySnowmen: -1,
  health: {
    idleDate: "2019-10-12T15:35:33.339Z",
    lastFppDate: "2019-10-12T15:35:33.339Z",
    lastNameMqtt: "2019-10-12T15:35:32.983Z",
    lastnameGenereate: "2019-10-12T15:34:15.796Z",
    lastnamePlay: "2019-10-12T15:34:15.796Z",
    status: "ALL_OK",
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
    topPlayedSongs_year: [],
    totalPower_year: {
      kwh: 0,
      dollars: 0,
    }
  },
  powerStats: {
    hours: 23.245833333333334,
    avgWatt: 266.26108066633293,
    kwh: 6.189460704322797,
    dollars: 0.5322936205717604,
    cnt: 83685,
  },
  current: {
    status: "idle",
    enabled: true,
    secondsTotal: -1,
    secondsRemaining: -1,
    isDisplayHours: false,
    isShortList: false,
    title: "",
  },
  lastMessage: "OK",
  votesRemaining: 8,
  lastUpdated: "Never",
  lastUpdatedTime: "Never",
};

const getters = {
  allAvailSongs: (state) => state.availSongs.filter((s) => s.votes >= 10),
  availSongCount: (state) => state.availSongs.length,
  totalDurationMinutes: (state) => state.totalDurationMinutes,
  allOldSongs: (state) =>
    state.availSongs.filter((s) => s.votes < 10 && s.votes > -100),
  allDisabledSongs: (state) => state.availSongs.filter((s) => s.votes < -100),
  allNames: (state) => state.nameQueue,
  allSnowmen: (state) => state.snowmenQueue,
  currentSong: (state) => state.current,
  votesRemaining: (state) => state.votesRemaining,
  mySnowmen: (state) => state.mySnowmen,
  lastMessage: (state) => state.lastMessage,
  lastUpdated: (state) => state.lastUpdated,
  lastUpdatedTime: (state) => state.lastUpdatedTime,
  stats: (state) => state.stats,
  powerStats: (state) => state.powerStats,
  lastStats: (state) => state.lastStats,
  health: (state) => state.health,
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

    client.onUpdate = (update) => {
      commit("setPublic", update);
    };
  },
  async fetchState({ commit }) {
    let r = await axios.get("https://vote-now.org/api/queue");
    //let r = await axios.get('http://localhossetSongst:7654/queue');
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  },
  async addVote({ commit }, id) {
    let r = await axios.post("https://vote-now.org/api/vote/" + id);
    //let r = await axios.get('http://localhost:7654/vote/' + id);
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  },
  async addSnowmanVote({ commit }, id) {
    let r = await axios.post("https://vote-now.org/api/votesnowman/" + id);
    //let r = await axios.get('http://localhost:7654/votesnowman/' + id);
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  },
  async removeVote({ commit }, id) {
    let r = await axios.delete("https://vote-now.org/api/vote/" + id);
    //let r = await axios.delete('http://localhost:7654/vote/' + id);
    commit("setSongs", r.data);
    commit("setPublic", r.data.model);
  },
};

const mutations = {
  setPublic: (state, input) => {
    state.availSongs = input.songs;
    state.snowmenQueue = input.snowmenQueue
    state.oldSongs = input.oldSongs;
    state.nameQueue = input.nameQueue;
    state.current = input.current;
    state.health = input.health;
    state.stats = input.stats;
    state.powerStats = input.powerStats;
    state.lastUpdated = new Date();
    state.lastUpdatedTime = moment().format("LTS");
    state.health.lastStatsTime = moment(input.health.lastStats).format("LTS");

    // Total button presses
    state.stats.total_buttons = 0;
    if ("topButton_year" in state.stats) {
      for (const b of state.stats["topButton_year"]) {
        state.stats.total_buttons += b["cnt"];
      }
    }

    state.stats.total_phones = 0;
    if ("topPhones" in state.stats) {
      for (const phone of state.stats["topPhones"]) {
        // it is always the last one, so this trick works.
        state.stats.total_phones = phone["cnt"];
      }
    }

    // Fix formatting
    state.powerStats.kwh = Math.round(state.powerStats.kwh * 100) / 100;
    state.powerStats.dollars = Math.round(state.powerStats.dollars * 100) / 100;
    var minutes = 0
    for (const song of state.availSongs) {
      minutes += song.duration
    }
    minutes = Math.round(minutes / 60)
    state.totalDurationMinutes = minutes
  },
  setSongs: (state, input) => {
    state.votesRemaining = input.votesRemaining.remaining;
    state.lastMessage = input.votesRemaining.status;
    state.mySnowmen = input.votesRemaining.snowmanId;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

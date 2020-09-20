module.exports.songs = [];
/*
  {
    id: 1,
    title: "Dance of the Sugar Plum Fairy",
    votes: 20,
    shortlist: false,
    playlist: "Sugar_Plum"
  }
  */

module.exports.nameQueue = [
  {
    id: 1,
    name: "Test name #1",
  },
  {
    id: 2,
    name: "Test name #2",
  },
];

module.exports.clock = {
  time: 9999999,
  startedPrep: false,
  startedMidnight: false,
};

module.exports.current = {
  status: "Undefined",
  nameStatus: "Undefined",
  secondsTotal: -1,
  secondsRemaining: -1,
  title: "",
  isDisplayHours: false,
  isShortList: false,
  enabled: true,
  debug: false,
};
module.exports.stats = {
  topNames_1hr: [],
  topNames_24hr: [],
  topNames_year: [],
  topSongs_1hr: [],
  topSongs_24hr: [],
  topSongs_year: [],
  topPlayedSongs_1hr: [],
  topPlayedSongs_24hr: [],
  topPlayedSongs_year: [],
  songPower_1hr: [],
  songPower_24hr: [],
  totalPower_1hr: {
    wattSeconds: 0.0,
    minutes: 0.8,
    kwh: 0.0,
    dollars: 0.0,
    avgWatt: 0.0,
  },
  totalPower_24hr: {
    wattSeconds: 0.0,
    minutes: 0.8,
    kwh: 0.0,
    dollars: 0.0,
    avgWatt: 0.0,
  },
  totalPower_year: {
    wattSeconds: 0.0,
    minutes: 0.8,
    kwh: 0.0,
    dollars: 0.0,
    avgWatt: 0.0,
  },
};

module.exports.powerStats = {
  hours: 12.984722222222222,
  avgWatt: 257.7378189025445,
  kwh: 3.346653984610956,
  dollars: 0.2878122426765422,
  cnt: 46745,
};

module.exports.schedulerStatus = {
  status: "UNKNOWN",
  nameStatus: "IDLE",
  isDisplayHours: false,
};
module.exports.health = {
  idleDate: "",
  lastSchedulerDate: "",
  lastFppDate: "",
  lastNameMqtt: "",
  lastPowerStats: "",
  lastnameGenereate: "",
  lastnamePlay: "",
  status: "UNKNOWN",
  lastStats: "",
};

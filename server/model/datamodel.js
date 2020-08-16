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
    name: "Test name #1"
  },
  {
    id: 2,
    name: "Test name #2"
  }
];

module.exports.clock = {
  time: 9999999,
  startedPrep: false,
  startedMidnight: false
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
  debug: false
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
  topPlayedSongs_year: []
};
module.exports.schedulerStatus = {
  "status":"UNKNOWN",
  "nameStatus":"IDLE",
  "isDisplayHours" : false
}
module.exports.health = {
  idleDate: "",
  lastSchedulerDate: "",
  lastFppDate: "",
  lastNameMqtt: "",
  lastnameGenereate: "",
  lastnamePlay: "",
  status: "UNKNOWN",
  lastStats: ""
};

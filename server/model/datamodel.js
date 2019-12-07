module.exports.songs = [
  {
    id: 1,
    title: "Dance of the Sugar Plum Fairy",
    votes: 20,
    shortlist: false,
    playlist: "Sugar_Plum"
  },
  {
    id: 2,
    title: "EDM Carol of the Bells",
    votes: 19,
    shortlist: true,
    playlist: "EDM"
  },
  {
    id: 3,
    title: "I Want a Hippopotamus for Christmas",
    votes: 18,
    shortlist: true,
    playlist: "Hippo"
  },
  {
    id: 4,
    title: "House on Christmas Street",
    votes: 17,
    shortlist: false,
    playlist: "Christmas_Street"
  },
  {
    id: 5,
    title: "Light of Christmas",
    votes: 16,
    shortlist: true,
    playlist: "Light_of Christmas"
  },
  {
    id: 6,
    title: "12 Days of Christmas",
    votes: 15,
    shortlist: true,
    playlist: "12_Days"
  },
  {
    id: 7,
    title: "Jingle Dogs",
    votes: 14,
    shortlist: false,
    playlist: "Jingle_Dogs"
  },
  {
    id: 8,
    title: "I heard the bells on Christmas Day",
    shortlist: false,
    votes: 13,
    playlist: "Heard_Bells"
  },
  {
    id: 9,
    title: "Little Drummer Boy",
    shortlist: true,
    votes: 12,
    playlist: "Drummer"
  },
  {
    id: 10,
    title: "Amazing Grace",
    shortlist: false,
    votes: 11,
    playlist: "Amazing_Grace"
  },
  {
    id: 11,
    title: "Christmas Minions",
    votes: 10,
    shortlist: false,
    playlist: "Minions"
  },
  {
    id: 12,
    title: "Here comes Santa Claus",
    votes: 29,
    shortlist: false,
    playlist: "Santa_Claus"
  },
  {
    id: 13,
    title: "Christmas Cannon",
    votes: 28,
    shortlist: false,
    playlist: "Cannon"
  },
  {
    id: 14,
    title: "Joy to the World",
    votes: 10,
    shortlist: false,
    playlist: "Joy"
  }
];

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
module.exports.health = {
  idleDate: "",
  lastFppDate: "",
  lastNameMqtt: "",
  lastnameGenereate: "",
  lastnamePlay: "",
  status: "UNKNOWN",
  lastStats: ""
};

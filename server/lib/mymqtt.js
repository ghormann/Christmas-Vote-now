const mqtt = require("mqtt");
const moment = require("moment");
const fs = require("fs");
const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");
const myUtils = require("../lib/myUtils.js");

const master_config = {
  send_enabled: false,
  playGoodNight: false,
};
var normalNames = [];
var lowNames = [];
var readyNames = [];
var client = undefined;
var callbacks = [];
var last_send = 10;
var last_intro = 10;
var last_short_show = 10;
var last_station = 10;
var last_nameGen = moment().subtract(1, "day").toDate();

var handlers = [
  {
    topic: "/christmas/nameQueue",
    callback: function (topic, message) {
      datamodel.health.lastNameMqtt = moment().toDate();
      let data = JSON.parse(message.toString());
      normalNames = data.normal;
      lowNames = data.low;
      readyNames = data.ready;
      datamodel.current.nameStatus = data.status;
      if (data.status === "GENERATING") {
        last_nameGen = Date.now();
        datamodel.health.lastnameGenereate = moment().toDate();
      }
      updateNames(true);
    },
  },
  {
    topic: "/christmas/scheduler/status",
    callback: function (topic, message) {
      let status = JSON.parse(message.toString());
      datamodel.schedulerStatus = status;
      datamodel.current.isDisplayHours =
        datamodel.schedulerStatus.isDisplayHours;
      datamodel.health.lastSchedulerDate = moment().toDate();
      datamodel.health.lastnamePlay = status.lastNamePlay;
      datamodel.health.lastnameGenereate = status.lastNameGen;
      datamodel.current.isShortList = status.shortList;
      datamodel.current.debug = status.debug; // Scheduler should be the master
      datamodel.current.enabled = status.enabled; // Scheduler should be the master
    },
  },
  {
    topic: "/christmas/scheduler/all_playlist",
    callback: function (topic, message) {
      let songs = JSON.parse(message.toString());
      songs.forEach(function (newSong) {
        let found = false;
        datamodel.songs.forEach(function (oldSong) {
          if (oldSong.playlist === newSong.name) {
            found = true;
            oldSong.title = newSong.desc;
            oldSong.shortlist = newSong.shortlist;
          }
        });
        if (!found) {
          // Need to add
          let song = createNewSong();
          song.title = newSong.desc;
          song.shortlist = newSong.shortlist;
          song.playlist = newSong.name;
          myUtils.sortSongs();
          datamodel.songs.push(song);
        }
      });
    },
  },
  {
    topic: "/christmas/clock",
    callback: function (topic, message) {
      let data = parseInt(message.toString());
      datamodel.clock.time = data;
    },
  },
  {
    topic: "/christmas/todayPower",
    callback: function (topic, message) {
      let data = JSON.parse(message.toString());
      datamodel.powerStats = data;
      datamodel.health.lastPowerStats = moment().toDate();
    },
  },
  {
    topic: "/christmas/vote/stats",
    callback: function (topic, message) {
      let data = JSON.parse(message.toString());
      datamodel.stats = data;
      datamodel.health.lastStats = moment().toDate();
      addSongnameToVotes();
      addSongnameToSongs();
    },
  },
  {
    topic: "/christmas/vote/setShortList",
    callback: function (topic, message) {
      let data = message.toString();
      if (data.toUpperCase() === "TRUE") {
        datamodel.current.isShortList = true;
      }
      if (data.toUpperCase() === "FALSE") {
        datamodel.current.isShortList = false;
      }
      myUtils.addRandomVotes(); // Reset votes
      console.log(
        "Changing isShortList to ",
        datamodel.current.isShortList,
        " because of ",
        data
      );
    },
  },
  {
    topic: "/christmas/vote/debug",
    callback: function (topic, message) {
      let data = message.toString();
      if (data.toUpperCase() === "TRUE") {
        datamodel.current.debug = true;
      }
      if (data.toUpperCase() === "FALSE") {
        datamodel.current.debug = false;
      }
      console.log(
        "Changing debug to ",
        datamodel.current.debug,
        " because of ",
        data
      );
    },
  },
  {
    topic: "/christmas/falcon/player/FPP.hormann.local/playlist_details",
    callback: function (topic, message) {
      let data = JSON.parse(message.toString());
      datamodel.health.lastFppDate = moment().toDate();
      datamodel.current.status = data.status;
      datamodel.current.title = "Unknown";
      datamodel.current.secondsTotal = -1;
      datamodel.current.secondsRemaining = -1;
      if (data.status != "idle") {
        datamodel.health.idleDate = moment().toDate();
      }
      if ("activePlaylists" in data) {
        // Convert playlist to nice name
        // and set vote count if currently playing
        data.activePlaylists.forEach(function (e) {
          datamodel.current.title = e.description;
          datamodel.songs.forEach(function (s) {
            if (e.name === s.playlist) {
              datamodel.current.title = s.title;
              if (s.votes > 7) {
                session.clearVotesForSong(s.id);
                s.votes = 7; // <10 not displayed
                myUtils.sortSongs();
              }
            }
          });

          if ("currentItems" in e) {
            e.currentItems.forEach(function (i) {
              datamodel.current.secondsRemaining = i.secondsRemaining;
              datamodel.current.secondsTotal = i.secondsTotal;
            });
          }
        });
      }
      fireCallbacks();
    },
  },
];

/*
 * creates template for now Song record.
 */
function createNewSong() {
  let id = 0;
  datamodel.songs.forEach(function (s) {
    s.votes = s.votes + 1;
    if (s.id > id) {
      id = s.id;
    }
  });

  id = id + 1;
  return {
    id: id,
    title: "Unknown",
    votes: 10,
    shortlist: false,
    playlist: "Unknown",
  };
}

function requestSongList() {
  // If songs are not here, schedule another check.
  if (datamodel.songs.length == 0) {
    console.log("WARNING: No avaiable songs");
    setTimeout(requestSongList, 1500);
  }
  let topic = "/christmas/scheduler/requestSongs";
  let msg = "1";
  client.publish(topic, msg, function (err) {
    if (err) {
      console.log("Unalbe to publish Reqeust for new SOngs");
    }
  });
}

function sendVote(song, session) {
  let topic = "/christmas/vote/add";
  let msg = JSON.stringify({
    id: song.id,
    playlist: song.playlist,
    source: session,
  });
  client.publish(topic, msg, function (err) {
    if (err) {
      console.log("Error Publishing to " + topic);
      console.log(err);
    }
  });
}

function sendSongQueue() {
  let topic = "/christmas/vote/songQueue";
  let msg = JSON.stringify(datamodel.songs);

  client.publish(topic, msg, function (err) {
    if (err) {
      console.log("Error Publishing SongQueue to " + topic);
      console.log(err);
    }
  });
}

function sendName(name) {
  console.log("Adding name to the queue " + name);
  let topic = "/christmas/personsName";
  client.publish(topic, name, function (err) {
    if (err) {
      console.log("Error Publishing to " + topic);
      console.log(err);
    }
  });
}

function addCallback(c) {
  callbacks.push(c);
}

function updateNames(doBroadcast) {
  var allNames = [];
  var id = 1;

  readyNames.forEach(function (n) {
    allNames.push({
      id: id,
      name: n.name,
      ts: n.ts,
      type: "READY",
    });
    id += 1;
  });

  normalNames.forEach(function (n) {
    allNames.push({
      id: id,
      name: n.name,
      ts: n.ts,
      type: "NORMAL",
    });
    id += 1;
  });

  lowNames.forEach(function (n) {
    allNames.push({
      id: id,
      name: n.name,
      ts: n.ts,
      type: "LOW",
    });
    id += 1;
  });

  datamodel.nameQueue = allNames;
  // fire callbacks
  if (doBroadcast) {
    fireCallbacks();
  }
}

function fireCallbacks() {
  callbacks.forEach(function (c) {
    c(datamodel);
  });
}

function init() {
  let rawdata = fs.readFileSync("greglights_config.json");
  let config = JSON.parse(rawdata);
  //let CA = [fs.readFileSync(config["ca_file"])];
  master_config.send_enabled = config["send_enabled"];

  datamodel.health.idleDate = moment().toDate();
  datamodel.health.lastFppDate = datamodel.health.idleDate;
  datamodel.health.lastNameMqtt = datamodel.health.idleDate;
  datamodel.health.lastnameGenereate = datamodel.health.idleDate;
  datamodel.health.lastnamePlay = datamodel.health.idleDate;

  let options = {
    host: config["host"],
    port: config["port"],
    username: config["username"],
    password: config["password"],
    //protocol: "mqtts",
    protocol: "mqtt",
    //ca: CA,
    clientId: "vote_" + Math.random().toString(16).substr(2, 8),
    //secureProtocol: "TLSv1_2_method",
    protocolId: "MQIsdp",
    protocolVersion: 3,
  };

  setInterval(sendSongQueue, 2000);

  client = mqtt.connect(options);
  client.on("connect", function () {
    console.log("MQTT Connect");
    handlers.forEach(function (h) {
      client.subscribe(h.topic, function (err) {
        if (err) {
          console.log("Failed to subscribe to ", h.topic);
        }
      });
    });
    // Request song list
    requestSongList();
  });

  client.on("message", function (topic, message) {
    let handled = false;
    handlers.forEach(function (h) {
      if (topic == h.topic) {
        h.callback(topic, message);
        handled = true;
      }
    });
    if (!handled) {
      console.log("Warning: Unabled MQTT topic: ", topic);
    }
  });
}

function addSongnameToVotes() {
  let songById = [];
  datamodel.songs.forEach(function (s) {
    songById[s.id] = s.title;
  });

  datamodel.stats.topSongs_1hr.forEach(function (i) {
    i.title = songById[i.id];
  });
  datamodel.stats.topSongs_24hr.forEach(function (i) {
    i.title = songById[i.id];
  });
  datamodel.stats.topSongs_year.forEach(function (i) {
    i.title = songById[i.id];
  });
}

function addSongnameToSongs() {
  let songByPlaylist = {};
  datamodel.songs.forEach(function (s) {
    songByPlaylist[s.playlist] = s.title;
  });

  datamodel.stats.topPlayedSongs_year.forEach(function (i) {
    if (i.name in songByPlaylist) {
      i.title = songByPlaylist[i.name];
    } else {
      i.title = "Unknown";
    }
  });
  datamodel.stats.topPlayedSongs_1hr.forEach(function (i) {
    if (i.name in songByPlaylist) {
      i.title = songByPlaylist[i.name];
    } else {
      i.title = "Unknown";
    }
  });
  datamodel.stats.topPlayedSongs_24hr.forEach(function (i) {
    if (i.name in songByPlaylist) {
      i.title = songByPlaylist[i.name];
    } else {
      i.title = "Unknown";
    }
  });
}

module.exports.init = init;
module.exports.addCallback = addCallback;
module.exports.sendVote = sendVote;

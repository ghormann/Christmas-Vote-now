const mqtt = require("mqtt");
const moment = require("moment");
const fs = require("fs");
const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");
const myUtils = require("../lib/myUtils.js");

const master_config = {
  send_enabled: false,
  playGoodNight: false
};
var normalNames = [];
var lowNames = [];
var readyNames = [];
var client = undefined;
var callbacks = [];
var last_send = 10;
var last_intro = 10;
var last_station = 10;

var handlers = [
  {
    topic: "/christmas/nameQueue",
    callback: function(topic, message) {
      let data = JSON.parse(message.toString());
      normalNames = data.normal;
      lowNames = data.low;
      readyNames = data.ready;
      updateNames(true);
    }
  },
  {
    topic: "/christmas/falcon/player/FPP.hormann.local/playlist_details",
    callback: function(topic, message) {
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
        data.activePlaylists.forEach(function(e) {
          if (e.name === "Driveway") {
            datamodel.current.title = "Driveway Reminder";
          } else if (e.name === "Intro") {
            datamodel.current.title = "Welcome";
          } else if (e.name === "TuneTo") {
            datamodel.current.title = "Radio Station ID";
          } else if (e.name === "off") {
            datamodel.current.title = "Radio Only";
          } else if (e.name === "Wish_Name") {
            datamodel.current.title = "Showing Names";
          } else if (e.name === "Good_Night") {
            datamodel.current.title = "Good Night";
          }
          datamodel.songs.forEach(function(s) {
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
            e.currentItems.forEach(function(i) {
              datamodel.current.secondsRemaining = i.secondsRemaining;
              datamodel.current.secondsTotal = i.secondsTotal;
            });
          }
        });
      }
      fireCallbacks();
    }
  }
];

function doSend(playlist) {
  let diff = Date.now() - last_send;
  if (diff < 3000) {
    // Sent something recently. Wait a minute
    return;
  }
  console.log("Sending " + playlist);
  let topic =
    "/christmas/falcon/player/FPP.hormann.local/set/playlist/" +
    playlist +
    "/start";
  last_send = Date.now();
  client.publish(topic, "1", {}, function(err) {
    if (err) {
      console.log("Error publishing topic");
      console.log(err);
    }
  });
}

function getCurrentHour()
{
    let myTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York"
    });
    myTime = new Date(myTime);
    return myTime.getHours();
}

function doSendCheck() {
  datamodel.current.isDisplayHours = myUtils.isDisplayHours();
  if (!master_config.send_enabled) {
    return;
  }
  if (! datamodel.current.isDisplayHours) {
    if (datamodel.current.status === "idle") {
      let hour = getCurrentHour();
      if (hour == 23 && master_config.playGoodNight) {
        master_config.playGoodNight = false;
        doSend("Good_Night");
      }
      if (hour > 8 && hour < 16) {
        // During day
        doSend("off");
      }
      if (hour < 5) {
        // early Morning
        doSend("off");
      }
    }
    return;
  }
  if (datamodel.current.status === "idle") {
    let hour = getCurrentHour();

    if (hour == 22) {
      // reset the playGoodNight flag
      master_config.playGoodNight = true;
    }

    if (Date.now() - last_intro > 900000) { // 15 min
      last_intro = Date.now();
      doSend("Intro");
    } else if (Date.now() - last_station > 480000) { // 8 min
      last_station = Date.now();
      doSend("TuneTo");
    } else {
      let song = datamodel.songs[0];
      doSend(song.playlist);
    }
  }
}

function addCallback(c) {
  callbacks.push(c);
}

function updateNames(doBroadcast) {
  var allNames = [];
  var id = 1;

  readyNames.forEach(function(n) {
    allNames.push({
      id: id,
      name: n,
      type:"READY"
    });
    id += 1;
  });

  normalNames.forEach(function(n) {
    allNames.push({
      id: id,
      name: n,
      type: "NORMAL"
    });
    id += 1;
  });

  lowNames.forEach(function(n) {
    allNames.push({
      id: id,
      name: n,
      type: "LOW"
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
  callbacks.forEach(function(c) {
    c(datamodel);
  });
}

function init() {
  let rawdata = fs.readFileSync("greglights_config.json");
  let config = JSON.parse(rawdata);
  let CA = [fs.readFileSync(config["ca_file"])];
  master_config.send_enabled = config["send_enabled"];

  datamodel.health.idleDate = moment()
    .subtract(10, "days")
    .toDate();
  datamodel.health.lastFppDate = moment()
    .subtract(10, "days")
    .toDate();

  let options = {
    host: config["host"],
    port: config["port"],
    username: config["username"],
    password: config["password"],
    protocol: "mqtts",
    ca: CA,
    clientId:
      "vote_" +
      Math.random()
        .toString(16)
        .substr(2, 8),
    secureProtocol: "TLSv1_2_method",
    protocolId: "MQIsdp",
    protocolVersion: 3
  };

  setInterval(doSendCheck, 500);

  client = mqtt.connect(options);
  client.on("connect", function() {
    console.log("MQTT Connect");
    handlers.forEach(function(h) {
      client.subscribe(h.topic, function(err) {
        if (err) {
          console.log("Failed to subscribe to ", h.topic);
        }
      });
    });
  });

  client.on("message", function(topic, message) {
    let handled = false;
    handlers.forEach(function(h) {
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

module.exports.init = init;
module.exports.addCallback = addCallback;

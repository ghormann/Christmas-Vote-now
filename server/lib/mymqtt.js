const mqtt = require("mqtt");
const fs = require("fs");
const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");
var normalNames = [];
var lowNames = [];
var client = undefined;
var callbacks = [];

var handlers = [
  {
    topic: "/christmas/nameQueue",
    callback: function(topic, message) {
      let data = JSON.parse(message.toString());
      normalNames = data;
      updateNames(true);
    }
  },
  {
    topic: "/christmas/nameQueueLow",
    callback: function(topic, message) {
      let data = JSON.parse(message.toString());
      lowNames = data;
      updateNames(false);
    }
  },
  {
    topic: "/christmas/falcon/player/FPP.hormann.local/playlist_details",
    callback: function(topic, message) {
      let data = JSON.parse(message.toString());
      datamodel.current.status = data.status;
      datamodel.current.title = "Unknown";
      datamodel.current.secondsTotal = -1;
      datamodel.current.secondsRemaining = -1;
      if ("activePlaylists" in data) {
        // Convert playlist to nice name
        // and set vote count if currently playing
        data.activePlaylists.forEach(function(e) {
          if (e.name === "Driveway") {
            datamodel.current.title = "Driveway Reminder";
          } else if (e.name === "Intro") {
            datamodel.current.title = "Welcome";
          } else if (e.name === "Tune To") {
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
              session.clearVotesForSong(s.id);
              s.votes = 7; // <10 not displayed
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

function addCallback(c) {
  callbacks.push(c);
}

function updateNames(doBroadcast) {
  var allNames = [];
  var id = 1;

  normalNames.forEach(function(n) {
    allNames.push({
      id: id,
      name: n
    });
    id += 1;
  });

  lowNames.forEach(function(n) {
    allNames.push({
      id: id,
      name: n
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

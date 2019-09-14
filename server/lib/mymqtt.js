const mqtt = require("mqtt");
const fs = require("fs");
const datamodel = require("../model/datamodel.js");
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
      datamodel.current.title = "";
      datamodel.current.secondsTotal = -1;
      datamodel.current.secondsRemaining = -1;
      if ("activePlaylists" in data) {
        data.activePlaylists.forEach(function(e) {
          datamodel.current.title = e.name;
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

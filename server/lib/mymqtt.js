const mqtt = require("mqtt");
const fs = require("fs");
const datamodel = require("../model/datamodel.js");
var normalNames = [];
var lowNames = [];
var client = undefined;

var handlers = [
  {
    topic: "/christmas/nameQueue",
    callback: function(topic, message) {
      let data = JSON.parse(message.toString());
      normalNames = data;
      updateNames();
    }
  },
  {
    topic: "/christmas/nameQueueLow",
    callback: function(topic, message) {
      let data = JSON.parse(message.toString());
      lowNames = data;
      updateNames();
    }
  }
];

function updateNames() {
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
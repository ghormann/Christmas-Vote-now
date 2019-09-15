const Hapi = require("@hapi/hapi");
const Nes = require("@hapi/nes");
const session = require("./lib/session.js");
const fs = require("fs");
const mymqtt = require("./lib/mymqtt.js");
const dataModel = require("./model/datamodel.js");

console.log("WARNING: Cross site scripting enabled");

const server = new Hapi.Server({
  port: process.env.port || 7654,
  routes: {
    cors: true
  }
});

mymqtt.init();

let yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: "the-password-must-be-at-least-32-characters-long",
    ttl: 43800 * 60000, // 1 month
    isSecure: false
  }
};

// Setup timeouts
setInterval(session.clearAllVotes, 86400000); // 1 day
setInterval(function() {
  session.giveAnotherVote();
  dataModel.songs.forEach(function(s) {
    if (s.votes < 10) {
      s.votes += 1;
    }
  });
  dataModel.songs.sort(function(a, b) {
    return b.votes - a.votes;
  });

}, 120000); // 2 minutes

const start = async () => {
  await server.register(Nes);

  try {
    await server.register({
      plugin: require("@hapi/yar"),
      options: yarOptions
    });
  } catch (err) {
    console.error(err);
  }

  console.log("Loading routes");
  let routes = [];
  fs.readdirSync(__dirname + "/routes").forEach(file => {
    console.log("\t", file);
    routes = routes.concat(require(`./routes/${file}`));
  });
  // Add Routes
  server.route(routes);

  // Add NES Subscriptions
  server.subscription("/publicData");

  mymqtt.addCallback(function(dataModel) {
    server.broadcast(dataModel);
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

start();

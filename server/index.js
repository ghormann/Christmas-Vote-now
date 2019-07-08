const Hapi = require("@hapi/hapi");
const Nes = require("@hapi/nes");

const fs = require('fs');

const server = new Hapi.Server({
  port: process.env.port || 7654
});

const start = async () => {
  await server.register(Nes);

  console.log("Loading routes");
  let routes = [];
  fs.readdirSync(__dirname + "/routes")
          .forEach(file => {
                  console.log("\t", file);
                  routes = routes.concat(require(`./routes/${file}`))
          });
  // Add Routes
  server.route(routes);
  
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

start();

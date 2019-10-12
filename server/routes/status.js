const datamodel = require("../model/datamodel.js");
const myUtils = require("../lib/myUtils.js");

module.exports = [
  {
    method: "GET",
    path: "/status",
    handler: (request, h) => {
      myUtils.updateHealthStatus();
      return { status: datamodel.health.status, debug: datamodel.current.debug };
    }
  }
];

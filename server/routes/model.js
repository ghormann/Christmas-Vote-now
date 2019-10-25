const datamodel = require("../model/datamodel.js");

module.exports = [
  {
    method: "GET",
    path: "/model",
    handler: (request, h) => {
      return { status: "OK", model: datamodel};
    }
  }
];

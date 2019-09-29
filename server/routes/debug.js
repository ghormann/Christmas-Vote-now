const datamodel = require("../model/datamodel.js");

module.exports = [
    {
      method: ["POST", "GET"],
      path: "/debug/{id}",
      handler: (request, h) => {
        if (request.params.id.toUpperCase() === "TRUE") {
            datamodel.current.debug = true;
        }
        if (request.params.id.toUpperCase() === "FALSE") {
            datamodel.current.debug = false;
        }
        return {
            debug: datamodel.current.debug
          };
    
      }
    }
]
        
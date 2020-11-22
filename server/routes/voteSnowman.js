const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");
const myUtils = require("../lib/myUtils.js");
const mymqtt = require("../lib/mymqtt.js");


module.exports = [
  {
    method: ["GET", "POST"],
    path: "/votesnowman/{id}",
    handler: (request, h) => {
      let key = session.checkSession(request);
      let id = parseInt(request.params.id);
      let votes = session.addSnowmanVote(key, id);
      mymqtt.sendSnowmanVote(id,key);


      request.server.broadcast(datamodel);
      return {
        status: "OK",
        model: datamodel,
        votesRemaining: votes
      };
    }
  }
];

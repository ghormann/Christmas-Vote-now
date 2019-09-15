const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");
const myUtils = require("../lib/myUtils.js");


module.exports = [
  {
    method: ["DELETE"],
    path: "/vote/{id}",
    handler: (request, h) => {
      let key = session.checkSession(request);
      let id = parseInt(request.params.id);
      let votes = session.removeVote(key, id);
      if (votes.status == "OK") {
        datamodel.songs.forEach(e => {
          if (e.id == id) {
            e.votes = e.votes - 1;
            console.log("Decrease: " + e.title + " to " + e.votes);
            myUtils.sortSongs();
          }
        });
      }

      request.server.broadcast(datamodel);
      return {
        status: votes.status,
        model: datamodel,
        votesRemaining: votes
      };
    }
  }
];

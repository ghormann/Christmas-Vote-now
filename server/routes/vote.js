const datamodel = require("../model/datamodel.js");
const session = require("../lib/session.js");

module.exports = [
  {
    method: ["GET", "POST"],
    path: "/vote/{id}",
    handler: (request, h) => {
      let key = session.checkSession(request);
      let id = parseInt(request.params.id);
      console.log("Searching for " + id);
      let votes = session.decrementVote(key);
      let status = "OK";
      if (votes > 0) {
        datamodel.songs.forEach(e => {
          if (e.id == id) {
            e.votes = e.votes + 1;
            console.log("Incrementing: " + e.title + " to " + e.votes);
            datamodel.songs.sort(function(a, b) {
              return b.votes - a.votes;
            });
          }
        });
      } else {
          status = "No Votes Remaining";
      }

      return {
        status: status,
        model: datamodel,
        votesRemaining: session.getVotesRemaining(key)
      };
    }
  }
];

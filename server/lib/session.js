const uuidv4 = require("uuid/v4");
const maxVotes = 8;
var votesRemaining = {};

function getVotesRemaining(id) {
  if (!(id in votesRemaining)) {
    console.log("Creating");
    votesRemaining[id] = maxVotes;
  }
  return votesRemaining[id];
}
function decrementVote(id) {
  let cur = getVotesRemaining(id); // Force creation if doesn't exists.
  if (cur > 0) {
    votesRemaining[id] = cur - 1;
  }
  return getVotesRemaining(id);
}

function clearAllVotes(){
  console.log("Clearning all votes");
  votesRemaining = {};
}

function giveAnotherVote() {
  console.log("Giving more votes");
  for (id in votesRemaining) {
    let votes = votesRemaining[id];
    if (votes< maxVotes) {
      votesRemaining[id] = votes + 1;
    }
  }
}

function checkSession(request) {
  let key = request.yar.get("session_key");
  console.log("Before: ", key);
  if (!key) {
    key = uuidv4();
    console.log("Creating new key", key);
    request.yar.set("session_key", key);
  }
  return key;
}

module.exports.checkSession = checkSession;
module.exports.decrementVote = decrementVote;
module.exports.getVotesRemaining = getVotesRemaining;
module.exports.clearAllVotes = clearAllVotes;
module.exports.giveAnotherVote = giveAnotherVote;
const uuidv4 = require("uuid/v4");
const maxVotes = 8;
var votesRemaining = {};

function getOrCreateVoteRecord(id) {
  if (!(id in votesRemaining)) {
    console.log("Creating");
    votesRemaining[id] = {
      remaining: maxVotes,
      history: [],
      status: "OK"
    };
  }
  return votesRemaining[id];
}

function addVote(id, songId) {
  let record = getOrCreateVoteRecord(id);
  record.status = "No Votes Remaining";
  if (record.remaining > 0) {
    record.remaining = record.remaining - 1;
    record.history.push(songId);
    record.status = "OK";
  }

  return record;
}

function removeVote(id, songId) {
  let record = getOrCreateVoteRecord(id); // Force creation if doesn't exists.
  record.status = "You have removed all votes from this song.";
  let idx = record.history.findIndex(p => p == songId);
  if (idx > -1) {
    record.history.splice(idx, 1);
    record.remaining = record.remaining + 1;
    record.status = "OK";
  }
  return record;
}

function clearAllVotes() {
  console.log("Clearning all votes");
  votesRemaining = {};
}

function giveAnotherVote() {
  console.log("Giving more votes");
  for (id in votesRemaining) {
    let votes = votesRemaining[id];
    if (votes < maxVotes) {
      votesRemaining[id] = votes + 1;
    }
  }
}

function checkSession(request) {
  let key = request.yar.get("session_key");
  if (!key) {
    key = uuidv4();
    console.log("Creating new key", key);
    request.yar.set("session_key", key);
  }
  return key;
}

module.exports.checkSession = checkSession;
module.exports.removeVote = removeVote;
module.exports.addVote = addVote;
module.exports.clearAllVotes = clearAllVotes;
module.exports.giveAnotherVote = giveAnotherVote;
module.exports.getOrCreateVoteRecord = getOrCreateVoteRecord;

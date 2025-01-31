const { v4: uuidv4 } = require('uuid');
const myUtils = require("./myUtils.js");
const datamodel = require("../model/datamodel.js");
const maxVotes = 8;
var votesRemaining = {};

function getOrCreateVoteRecord(id) {
  if (!(id in votesRemaining)) {
    console.log("Creating Session");
    votesRemaining[id] = {
      remaining: maxVotes,
      history: [],
      snowmanId: -1,
      status: "OK",
    };
  }
  return votesRemaining[id];
}

function addSnowmanVote(id, snowmanId) {
  let record = getOrCreateVoteRecord(id);
  if (snowmanId != record.snowmanId) {
    let oldId = record.snowmanId;
    record.snowmanId = snowmanId;
    datamodel.snowmenQueue.forEach(function (who) {
      // Decrement existing vote if present
      if (who.id == oldId) {
        who.votes -= 1;
        if (who.votes < 0) {
          who.votes = 0;
        }
      }
      if (who.id == snowmanId) {
        who.votes += 1;
      }
    });
    myUtils.sortSnowmen();
  }
  return record;
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

function clearVotesForSnowmen() {
  for (id in votesRemaining) {
    let record = getOrCreateVoteRecord(id);
    record.snowmanId = -1;
  }
}

function clearVotesForSong(songId) {
  for (id in votesRemaining) {
    let record = getOrCreateVoteRecord(id);
    let before = record.history.length;
    record.history = record.history.filter(function (a) {
      return a !== songId;
    });
    record.remaining = record.remaining + (before - record.history.length);
    if (record.remaining > maxVotes) {
      record.remaining = maxVotes;
    }
    if (record.remaining > 0) {
      record.status = "OK";
    }
  }
}

function removeVote(id, songId) {
  let record = getOrCreateVoteRecord(id); // Force creation if doesn't exists.
  record.status = "You don't have votes on this song";
  let idx = record.history.findIndex((p) => p == songId);
  if (idx > -1) {
    record.history.splice(idx, 1);
    record.remaining = record.remaining + 1;
    record.status = "OK";
  }
  return record;
}

function clearAllVotes(force = false) {
  if (datamodel.schedulerStatus.isDisplayHours && !force) {
    return; // Don't reset while display is running
  }
  console.log("Clearning all votes");
  votesRemaining = {};
  // Reset Votes on songs
  let i = 11 + datamodel.songs.length;
  datamodel.songs.forEach(function (s) {
    s.votes = i;
    --i;
  });
  myUtils.sortSongs();
}

function giveAnotherVote() {
  console.log("Giving more votes");
  for (id in votesRemaining) {
    let record = getOrCreateVoteRecord(id);
    let votes = record.remaining;
    if (votes < maxVotes) {
      record.remaining = votes + 1;
    }
    record.status = "OK";
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
module.exports.clearVotesForSong = clearVotesForSong;
module.exports.addSnowmanVote = addSnowmanVote;
module.exports.clearVotesForSnowmen = clearVotesForSnowmen;

const dataModel = require("../model/datamodel.js");

function sortSongs() {
  dataModel.songs.sort(function(a, b) {
    return b.votes - a.votes;
  });
}

function addRandomVotes() {
  dataModel.songs.forEach(function(s) {
    if (s.votes < 10) {
      s.votes += 1;
    } else {
      let r = Math.floor(Math.random() * 10);
      if (r < 7) {
        s.votes += 1;
      }
    }
  });
  sortSongs();
}

module.exports.sortSongs = sortSongs;
module.exports.addRandomVotes = addRandomVotes;

const dataModel = require("../model/datamodel.js");
const moment = require("moment");

// returns the cutoff point for songs that can receive notes
// lower than this and it was recently played
function getSongCutoff() {
  return 17;
}

function sortSongs() {
  dataModel.songs.sort(function (a, b) {
    return b.votes - a.votes;
  });
}

// First sort by votes
// If votes equal, make sure SNowman is first by default
// Then sort by name.
function sortSnowmen() {
  dataModel.snowmenQueue.sort(function (a, b) {
    if (b.votes == a.votes) {
      if (b.id == 0 || a.id == 0) {
        return a.id - b.id;
      }
      return a.name.localeCompare(b.name);
    }
    return b.votes - a.votes;
  });
}

function findSnowmanName(id) {
  let answer = "Unknown"
  dataModel.snowmenQueue.forEach(function (e) {
    if (e.id == id) {
      answer = e.name;
    }
  });
  return answer;
}

function addRandomVotes() {
  dataModel.songs.forEach(function (s) {
    if (dataModel.current.isShortList && !s.shortlist) {
      // Not avaiable tonight
      s.votes = -150;
    }
    if (!dataModel.current.isShortList && s.votes < -100) {
      // Reset if low
      s.votes = getSongCutoff();
    }
    if (s.votes < getSongCutoff()) {
      s.votes += 1;
    } else {
      let r = Math.floor(Math.random() * 10);
      if (r < 7 && dataModel.schedulerStatus.isDisplayHours) {
        s.votes += 1;
      }
    }
  });
  sortSongs();
}

function updateHealthStatus() {
  status = "ALL_OK";
  let ts = moment().toDate();
  //seconds
  let last_fpp_diff = (ts - dataModel.health.lastFppDate) / 1000;
  let idle_time = (ts - dataModel.health.idleDate) / 1000;
  let last_scheduler_diff = (ts - dataModel.health.lastSchedulerDate) / 1000;
  // minutes
  let lastStats = (ts - dataModel.health.lastStats) / 60000;
  let lastPowerStats = (ts - dataModel.health.lastPowerStats) / 1000;
  let showRunning = dataModel.schedulerStatus.isDisplayHours;

  if (last_fpp_diff > 10) {
    status = "MQQT_ERROR";
  } else if (last_scheduler_diff > 20) {
    status = "NO_SCHEDULER_MSG";
  } else if (idle_time > 10 && showRunning) {
    status = "IDLE_ERROR";
  } else if (lastStats > 5) {
    // 5 minutes
    status = "NO_STATS_ERROR";
  } else if (lastPowerStats > 5) {
    // 5 Seconds
    status = "NO_POWER_STATS_ERROR";
  } else if (dataModel.schedulerStatus.status != "ALL_OK") {
    status = dataModel.schedulerStatus.status;
  }
  dataModel.health.status = status;
}

function clearSnowmanVotes() {
  dataModel.snowmenQueue.forEach((s) => {
    s.votes = 0;
  });
  sortSnowmen();
}

module.exports.clearSnowmanVotes = clearSnowmanVotes;
module.exports.sortSongs = sortSongs;
module.exports.addRandomVotes = addRandomVotes;
module.exports.updateHealthStatus = updateHealthStatus;
module.exports.sortSnowmen = sortSnowmen;
module.exports.findSnowmanName = findSnowmanName;
module.exports.getSongCutoff = getSongCutoff;

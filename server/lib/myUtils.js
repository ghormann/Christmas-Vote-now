const dataModel = require("../model/datamodel.js");
const moment = require("moment");

function sortSongs() {
  dataModel.songs.sort(function(a, b) {
    return b.votes - a.votes;
  });
}

function addRandomVotes() {
  dataModel.songs.forEach(function(s) {
    if (dataModel.current.isShortList && !s.shortlist) {
      // Not avaiable tonight
      s.votes = -150;
    }
    if (!dataModel.current.isShortList && s.votes < -100) {
      // Reset if low
      s.votes = 10;
    }
    if (s.votes < 10) {
      s.votes += 1;
    } else {
      let r = Math.floor(Math.random() * 10);
      if (r < 7 && isDisplayHours()) {
        s.votes += 1;
      }
    }
  });
  sortSongs();
}

function nonStandardPlaylistTitles(playlist) {
  if (playlist === "Driveway") {
    return "Driveway Reminder";
  } else if (playlist === "Intro") {
    return "Welcome";
  } else if (playlist === "TuneTo") {
    return "Radio Station ID";
  } else if (playlist === "off") {
    return "Radio Only";
  } else if (playlist === "Short_Show") {
    return "Reduced Playlist";
  } else if (playlist === "Wish_Name") {
    return "Showing Names";
  } else if (playlist === "Good_Night") {
    return "Good Night";
  } else if (playlist === "Midnight_Prep") {
    return "Almost Midnight";
  } else if (playlist === "Midnight") {
    return "Merry Christmas";
  }

  return "Unknown";
}

function updateHealthStatus() {
  status = "ALL_OK";
  let ts = moment().toDate();
  //seconds
  let last_fpp_diff = (ts - dataModel.health.lastFppDate) / 1000;
  let idle_time = (ts - dataModel.health.idleDate) / 1000;
  // minutes
  let lastNamePlay = (ts - dataModel.health.lastnamePlay) / 60000;
  let lastNameGen = (ts - dataModel.health.lastnameGenereate) / 60000;
  let lastStats = (ts - dataModel.health.lastStats) / 60000;
  let showRunning = isDisplayHours();

  if (last_fpp_diff > 10) {
    status = "MQQT_ERROR";
  } else if (idle_time > 10 && showRunning) {
    status = "IDLE_ERROR";
  } else if (lastNamePlay > 40 && showRunning) {
    status = "NAME_PLAY_ERROR";
  } else if (lastNameGen > 40 && showRunning) {
    status = "NAME_GEN_ERROR";
  } else if (lastStats > 5) {
    status = "NO_STATS_ERROR";
  }
  dataModel.health.status = status;
}

function isDisplayHours() {
  let myTime = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York"
  });
  myTime = new Date(myTime);
  let hour = myTime.getHours();
  let month = myTime.getMonth() + 1;
  let day = myTime.getDate();

  //console.log("Month: ", month, "Day: ", day, "Hour: ", hour);
  if (month === 12 && day === 24 && hour > 17) {
    return true;
  }

  if (month === 12 && day === 31 && hour > 17) {
    return true;
  }

  if (dataModel.current.debug) {
    return true;
  }

  if (month === 12 && day === 25 && hour < 2) {
    return true;
  }

  if (month === 1 && day === 1 && hour < 2) {
    return true;
  }

  if (hour >= 6 && hour < 9) {
    return true;
  }

  if (hour >= 17 && hour < 23) {
    return true;
  }

  return false;
}

module.exports.sortSongs = sortSongs;
module.exports.addRandomVotes = addRandomVotes;
module.exports.isDisplayHours = isDisplayHours;
module.exports.updateHealthStatus = updateHealthStatus;
module.exports.nonStandardPlaylistTitles = nonStandardPlaylistTitles;

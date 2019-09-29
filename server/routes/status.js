const datamodel = require("../model/datamodel.js");
const moment = require('moment');
const myUtils = require('../lib/myUtils.js');

module.exports = [
  {
    method: "GET",
    path: "/status",
    handler: (request, h) => {
      status = "ALL_OK";
        var ts = moment().toDate();
        //console.log(ts);
        //console.log(datamodel.health);
        var diff1 = (ts - datamodel.health.lastFppDate) / 1000;
        var diff2 = (ts - datamodel.health.idleDate) / 1000;
        //console.log(diff1, " ", diff2);
        if (diff1 > 10) {
            status = "MQQT_ERROR";
        } else if (diff2 > 10 && myUtils.isDisplayHours()) {
            status = "IDLE_ERROR";
        }
      return { status: status, debug: datamodel.current.debug };
    }
  }
];

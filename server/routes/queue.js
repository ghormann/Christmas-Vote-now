const datamodel = require('../model/datamodel.js');

module.exports = [
    {
        method: "GET",
        path: "/queue",
        handler: (request, h) => {
            return {status: "OK", model: datamodel};
        }
    }
];
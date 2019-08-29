const datamodel = require('../model/datamodel.js');
const session = require('../lib/session.js');

module.exports = [
    {
        method: "GET",
        path: "/queue",
        handler: (request, h) => {
            let key = session.checkSession(request);
            let votes = session.getVotesRemaining(key);
            return {status: "OK", model: datamodel, votesRemaining: votes};
        }
    }
];
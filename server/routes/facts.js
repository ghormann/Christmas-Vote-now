const facts = require("../data/facts.js");

// GET /facts — season dates, show hours and display size for the vote-now.org
// pages, from the same data/facts.js that fills in the FAQ.
module.exports = [
  {
    method: "GET",
    path: "/facts",
    handler: (request, h) => {
      return { status: "OK", facts: facts.publicFacts() };
    }
  }
];

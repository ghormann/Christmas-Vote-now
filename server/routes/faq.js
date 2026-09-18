const faqs = require("../data/faqs.js");
const facts = require("../data/facts.js");

// GET /faq — the shared FAQ, rendered and ready to display.
//
// Query parameters (both optional):
//   audience  "web" | "app"  — only entries tagged for that consumer
//   site      base URL for links into thehormanns.net; pass an empty string
//             when the consumer *is* thehormanns.net so links stay relative
//
// Consumed by the vote-now.org info page and by thehormanns.net's FAQ page
// (at build time for structured data, then again in the browser for freshness).
module.exports = [
  {
    method: "GET",
    path: "/faq",
    handler: (request, h) => {
      const { audience, site } = request.query;
      const values = facts.tokens(
        site === undefined ? {} : { site: site }
      );

      const selected = audience
        ? faqs.filter(f => f.audience.includes(audience))
        : faqs;

      return {
        status: "OK",
        faqs: selected.map(f => ({
          id: f.id,
          audience: f.audience,
          question: f.question,
          answer: facts.render(f.answer, values)
        }))
      };
    }
  }
];

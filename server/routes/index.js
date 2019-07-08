module.exports = [
    {
        method: "GET", path: "/",
        handler: (request, h) => {
            return h.redirect("https://vote-now.org");
        }
    }
];
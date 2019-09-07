module.exports = [
  {
    method: "GET",
    path: "/ws",
    config: {
      id: "hello",
      handler: (request, h) => {
        return "world!";
      }
    }
  }
];

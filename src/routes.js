const tilestacker = require("./tilestacker");

module.exports = function(app, config) {
  app.get("/v1/tile/:z/:x/:y", (req, res, next) => {
    tilestacker
      .get(req.params, req.query, config)
      .then(node => {
        if (!node) return next();
        if (!node.contentType) return next();
        res.setHeader("Content-Type", node.contentType);
        res.send(node.buffer);
      })
      .catch(err => {
        next(err);
      });
  });
};

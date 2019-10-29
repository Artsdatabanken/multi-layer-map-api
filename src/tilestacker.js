const stack = require("./stack");

async function get(coords, query, config) {
  if (!query.layers)
    throw new Error('Query argument "layers" must be specified.');
  const tile = await stack(config, query.layers, coords);
  if (!tile) return null;
  tile.contentType = "image/png";
  return tile;
}

module.exports = { get };

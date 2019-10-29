const stack = require("./stack");

async function get(coords, query, config) {
  if (!query.layers)
    throw new Error('Query argument "layers" must be specified.');
  const layers = query.layers.split(",");
  const tile = await stack(config, layers, coords);
  if (!tile) return null;
  tile.contentType = "image/png";
  return tile;
}

module.exports = { get };

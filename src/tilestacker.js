const stack = require("./stack");

async function get(path, query, config) {
  const coords = decodePath(path);
  if (!query.layers)
    throw new Error('Query argument "layers" must be specified.');
  const layers = query.layers.split(",");
  const tile = await stack(config, layers, coords);
  if (!tile) return null;
  tile.contentType = "image/png";
  return tile;
}

function decodePath(path) {
  const segments = parsePath(path);
  if (segments.length < 3) return {};
  const coords = {
    z: readInt(segments, 0),
    x: readInt(segments, 1),
    y: readInt(segments, 2)
  };
  return coords;
}

function readInt(segments, index) {
  const v = parseInt(segments[index]);
  if (isNaN(v)) throw new Error("Bad arguments: " + segments.join(","));
  return v;
}

function parsePath(relativePath) {
  if (!relativePath) return [];
  const parts = relativePath.split("/");
  while (parts.length > 0 && parts[0] == "") parts.shift();
  return parts;
}

module.exports = { get };

const Mbtiles = require("./mbtiles");
const stackImages = require("./stackimages");
const path = require("path");
const log = require("log-less-fancy")();

async function stack(config, layers, coords) {
  const r = [];
  const fetches = [];
  for (var i = 0; i < layers.length; i++) {
    let sublayerName = layers[i];
    fetches.push(download(config, sublayerName, coords, i, r));
  }
  await Promise.all(fetches);
  const img = await stackImages(r);
  return img;
}

async function download(config, layer, coords, i, r) {
  const tile = await getTile(config, layer, coords);
  r[i] = { ...tile, layer: layer };
}

function tilepath(datadir, layername) {
  return path.join(datadir, layername, "raster_gradient.3857.mbtiles");
}

async function getTile(config, layer, coords) {
  const path = tilepath(config.dataDirectory, layer);
  try {
    const db = new Mbtiles(path);
    const buffer = await db.getTile(coords);
    db.close();
    return buffer && { buffer: buffer };
  } catch (err) {
    log.warn("Failed to read " + path + ":" + err);
  }
}

module.exports = stack;

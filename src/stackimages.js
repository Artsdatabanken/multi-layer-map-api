const Jimp = require("jimp");

async function stackImages(tiles) {
  const stack = await readImages(tiles);
  if (stack.width === 99999)
    throw new Error("None of source maps were found..");

  rescale(stack);

  const composite = await new Jimp(
    stack.width,
    stack.height,
    0x00000000,
    (err, compositex) => {}
  );
  compose(stack, composite);
  return {
    image: composite,
    stats: composite.stats,
    buffer: await composite.getBufferAsync(Jimp.MIME_PNG)
  };
}

function getSourceValue(sourceLayer, offset) {
  if (!sourceLayer) return 255;
  const srcAlpha = sourceLayer[offset + 3];
  return srcAlpha * sourceLayer[offset];
  // Make transparent areas 255 (nodata value)?
  //  bitmap[o + layer] = srcAlpha < 255 ? 255 : src[o];
}

function compose(stack, composite) {
  const bitmap = composite.bitmap.data;
  const layers = stack.images.map(layer =>
    layer.image ? layer.image.bitmap.data : null
  );
  var stats = [];
  for (var i = 0; i <= 4; i++) stats[i] = Array(256).fill(0);

  for (var o = 0; o < stack.width * stack.height * 4; ) {
    var v1 = getSourceValue(layers[0], o);
    var v2 = getSourceValue(layers[1], o);
    var v3 = getSourceValue(layers[2], o);
    var v4 = getSourceValue(layers[3], o);
    stats[0][v1]++;
    stats[1][v2]++;
    stats[2][v3]++;
    stats[3][v4]++;
    stats[4][v1 * v2 * v3 * v4]++;
    bitmap[o++] = v1;
    bitmap[o++] = v2;
    bitmap[o++] = v3;
    bitmap[o++] = v4;
  }
  composite.stats = stats;
}

function rescale(stack) {
  for (var i = 0; i < stack.images.length; i++) {
    const img = stack.images[i].image;
    if (!img) continue;
    if (img.bitmap.width === stack.width && img.bitmap.height === stack.height)
      continue;
    img.resize(stack.width, stack.height);
  }
}

async function readImages(tiles) {
  const r = { width: 99999, height: 99999 };
  r.images = [];
  for (var i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    var image = null;
    if (tile.buffer && tile.buffer.length > 0) {
      image = await Jimp.read(tile.buffer);
      r.width = Math.min(r.width, image.bitmap.width);
      r.height = Math.min(r.height, image.bitmap.height);
    }
    r.images[i] = { ...tile, image: image };
  }
  return r;
}

module.exports = stackImages;

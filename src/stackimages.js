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
  compose(
    stack,
    composite
  );
  return {
    image: composite,
    buffer: await composite.getBufferAsync(Jimp.MIME_PNG)
  };
}

function compose(stack, composite) {
  const bitmap = composite.bitmap.data;
  const layers = stack.images.map(layer =>
    layer.image ? layer.image.bitmap.data : null
  );
  for (var o = 0; o < stack.width * stack.height * 4; o += 4) {
    bitmap[o + 3] = 255;
    for (var layer = 0; layer < layers.length; layer++) {
      const src = layers[layer];
      if (src) bitmap[o + layer] = src[o];
    }
  }
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

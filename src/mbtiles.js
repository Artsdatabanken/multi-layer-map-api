const log = require("log-less-fancy")();
const Database = require("better-sqlite3");

const dbrow = (zoom, row) => (Math.pow(2, zoom) - 1 - row).toString();

class Mbtiles {
  constructor(dbPath, options = {}) {
    this.db = new Database(dbPath, {
      /*verbose: console.log*/
    });
  }

  close() {
    this.db.close();
  }

  getCommand() {
    if (this.getcmd) return this.getcmd;
    this.getcmd = this.db.prepare(
      "SELECT tile_data from tiles WHERE zoom_level=? AND tile_column=? AND tile_row=?"
    );
    return this.getcmd;
  }

  getTile(tileCoord) {
    const zoom = tileCoord.z;
    const row = tileCoord.y;
    const column = tileCoord.x;
    const dbRow = dbrow(zoom, row);
    const record = this.getCommand().get(zoom, column, dbRow);
    if (record) log.info(`Found ${this.db.name}/${zoom},${column},${dbRow}`);
    return record && new Buffer(record.tile_data);
  }

  close() {
    this.db.close();
  }
}

module.exports = Mbtiles;

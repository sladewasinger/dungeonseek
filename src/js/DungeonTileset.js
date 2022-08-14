import { Tile, TileAtlas } from './Tilemap.js';

export class DungeonTileset extends TileAtlas {
  constructor(tileSize, atlasImage) {
    super(tileSize, atlasImage);

    let i = 0;
    for (let x = 0; x < this.width; x += this.tileSize) {
      for (let y = 0; y < this.height; y += this.tileSize) {
        this.tiles.push(new Tile(this, x, y, i++));
      }
    }
  }

  addTile(x, y, index) {
    this.tiles.push(new Tile(this, x, y, index));
  }

  wall1() {
    return this.tiles[34];
  }

  wall2() {
    return this.tiles[35];
  }

  wall3() {
    return this.tiles[36];
  }
}

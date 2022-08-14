export class TileAtlas {
  constructor(tileSize, atlasImage) {
    this.tileSize = tileSize;
    this.atlasImage = atlasImage;
    this.width = atlasImage.image.width;
    this.height = atlasImage.image.height;
    this.tiles = [];
  }
}

export class Tile {
  constructor(tilemap, x, y, index) {
    this.tilemap = tilemap;
    this.x = x;
    this.y = y;
    this.index = index;
  }
}

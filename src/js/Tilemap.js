export class Tilemap {
  constructor() {
    this.tiles = [];
    this.width = 0;
    this.height = 0;
    console.log('TILE MAP');
  }
}

export class Tile {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

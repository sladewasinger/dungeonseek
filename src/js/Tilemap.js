class Tilemap {
  constructor() {
    this.tiles = [];
    this.width = 0;
    this.height = 0;
  }
}

class Tile { // Tile class
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

class TilemapLoader {
  constructor(path) {
    this.path = path
  }

  load(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.path, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var tilemap = new Tilemap();
          var lines = xhr.responseText.split('\n');
          tilemap.height = lines.length;
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            tilemap.width = line.length;
            for (var j = 0; j < line.length; j++) {
              var type = line.charAt(j);
              tilemap.tiles.push(new Tile(j, i, type));
            }
          }
          callback(tilemap);
        }
      }
    }
    xhr.send();
  }
}

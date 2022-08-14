const createjs = window.createjs;

export class GridDrawer {
  constructor(stage, container, tileSize, width, height) {
    this.container = container;
    const line = new createjs.Shape();
    line.regX = 0.5;
    line.regY = 0.5;
    line.snapToPixel = true;
    line.graphics.setStrokeStyle(1);
    line.graphics.beginStroke('rgba(255,0,0,0.5)');
    /* Begin at 0.5 to have a 1px width line */
    for (let x = 0.5; x <= width; x += tileSize) {
      line.graphics.moveTo(x, 0);
      line.graphics.lineTo(x, height);
    }
    for (let y = 0.5; y <= height; y += tileSize) {
      line.graphics.moveTo(0, y);
      line.graphics.lineTo(width, y);
    }

    let i = 0;
    for (let y = 0; y <= height; y += tileSize) {
      for (let x = 0; x <= width; x += tileSize) {
        const text = new createjs.Text(`${i++}`, '10px Arial', '#0a0');
        text.x = x;
        text.y = y;
        container.addChild(text);
      }
    }
    line.graphics.endStroke();
    this.container.addChild(line);
  }
}

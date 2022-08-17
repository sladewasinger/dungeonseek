import { Point } from './Shapes.js';
import { gravity, showHitBoxes } from './Constants.js';
const createjs = window.createjs;

export class Sprite extends createjs.Sprite {
  constructor(spriteSheet, frame, container, width, height, offsetX = 0, offsetY = 0) {
    super(spriteSheet, frame);

    this.container = container;
    this.container.addChild(this);

    this.width = width;
    this.height = height;
    this.x = -width / 2;
    this.y = -height / 2;
    this.regX = offsetX;
    this.regY = offsetY;

    if (showHitBoxes) {
      this.rect = new createjs.Shape();
      this.rect.graphics
        .beginStroke('#0a0')
        .setStrokeStyle(1)
        .drawRect(this.x, this.y, this.width, this.height)
        .endStroke();
      this.container.addChild(this.rect);
    }

    this.velocity = new Point(0, 0);
    this.gravity = true;
  }

  update() {
    if (showHitBoxes) {
      this.rect.x = this.x;
      this.rect.y = this.y;
    }
  }
}

export class PlayerSprite extends Sprite {
  constructor(spriteSheet, frame, container, width, height, offsetX = 0, offsetY = 0) {
    super(spriteSheet, frame, container, width, height, offsetX, offsetY);
    this.velocity.x = 0;
  }
}

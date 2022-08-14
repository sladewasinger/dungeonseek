import { Point } from './Shapes.js';
import { gravity } from './Constants.js';
const createjs = window.createjs;

export class Sprite extends createjs.Sprite {
  constructor(spriteSheet, frame, container, width, height) {
    super(spriteSheet, frame);

    this.container = container;
    this.container.addChild(this);

    this.width = width;
    this.height = height;
    this.x = 50;
    this.y = 50;

    this.rect = new createjs.Shape();
    this.rect.graphics
      .beginStroke('#0a0')
      .setStrokeStyle(1)
      .drawRect(this.x, this.y, this.width, this.height)
      .endStroke();
    this.container.addChild(this.rect);

    this.velocity = new Point(0, 0);
    this.gravity = true;
  }

  update() {
    this.rect.x = this.x - this.width / 2;
    this.rect.y = this.y - this.height / 2;
  }
}

export class PlayerSprite extends Sprite {
  constructor(spriteSheet, frame, container, width, height) {
    super(spriteSheet, frame, container, width, height);

    this.velocity.x = 1;
  }
}

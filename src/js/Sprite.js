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

    this.velocity = new Point(0, 0);
    this.gravity = true;
  }
}

export class PlayerSprite extends Sprite {
  constructor(spriteSheet, frame, container, width, height) {
    super(spriteSheet, frame, container, width, height);

    this.velocity.x = 1;
  }
}

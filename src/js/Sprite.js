import { Point } from './Shapes.js';
import { gravity, showHitBoxes } from './Constants.js';
import { _ } from 'core-js';
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
    this.velocity = { x: 0, y: 0 };
    this.gravity = false;

    if (showHitBoxes) {
      this.rect = new createjs.Shape();
      this.rect.graphics
        .beginStroke('#0a0')
        .setStrokeStyle(1)
        .drawRect(this.x, this.y, this.width, this.height)
        .endStroke();
      this.container.addChild(this.rect);
    }
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

export class WallTopMid {
  constructor(spriteSheet, container, width, height, offsetX = 0, offsetY = 0) {
    this.sprite1 = new Sprite(spriteSheet, 'wall_mid', container, width, height, offsetX, offsetY);
    this.sprite2 = new Sprite(spriteSheet, 'wall_top_mid', container, width, 4, offsetX, offsetY + 16);

    this.gravity = true;
  }

  get x() {
    return this.sprite1.x;
  }

  get y() {
    return this.sprite1.y;
  }

  set y(value) {
    this.sprite1.y = value;
    this.sprite2.y = value;
  }

  set x(value) {
    this.sprite1.x = value;
    this.sprite2.x = value;
  }

  get velocity() {
    return this.sprite1.velocity;
  }

  set velocity(value) {
    this.sprite1.velocity = value;
    this.sprite2.velocity = value;
  }

  update() {
    this.sprite1.update();
    this.sprite2.update();
  }
}

const createjs = window.createjs;

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.scale = 4;
    this.container = new createjs.Container();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

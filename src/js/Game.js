import { Tilemap } from './Tilemap.js';
const createjs = window.createjs;

export function init() {
  const stage = new createjs.Stage('gameCanvas');

  stage.canvas.addEventListener('resize', () => resize(stage.canvas));
  resize(stage.canvas);

  const circle = new createjs.Shape();
  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  stage.update();
}

function resize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

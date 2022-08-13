import { Tilemap } from './Tilemap.js';
import tileset from '@/assets/tiles/dungeonTileset.png';
const createjs = window.createjs;

export function init() {
  const stage = new createjs.Stage('gameCanvas');

  stage.canvas.addEventListener('resize', () => resize(stage.canvas));
  resize(stage.canvas);

  const circle = new createjs.Shape();
  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 500;
  circle.y = 500;
  stage.addChild(circle);
  stage.update();
  loadImage(stage);

  window.requestAnimationFrame((dt) => loop(dt, stage));
}

function loop(dt, stage) {
  stage.update();
  window.requestAnimationFrame((dt) => loop(dt, stage));
}

function loadImage(stage) {
  const preload = new createjs.LoadQueue();
  preload.addEventListener('fileload', (event) => handleFileComplete(event, stage));
  preload.loadFile(tileset);
}

function handleFileComplete(event, stage) {
  const bmp = new createjs.Bitmap(event.result);
  bmp.x = 50;
  bmp.y = 50;
  stage.addChild(bmp);
  stage.update();
  console.log('image loaded');
}

function resize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

import { Tilemap } from './Tilemap.js';
import tileset from '@/assets/tiles/dungeonTileset.png';
const createjs = window.createjs;

const circle = new createjs.Shape();

export function init() {
  const stage = new createjs.Stage('gameCanvas');
  stage.snapToPixel = true;
  stage.snapToPixelEnabled = true;

  window.addEventListener('resize', () => resize(stage.canvas));
  resize(stage.canvas);

  const cameraContainer = new createjs.Container();

  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 10;
  circle.y = 10;
  circle.z = 100;
  stage.addChild(circle);
  // cameraContainer.addChild(circle);
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
  bmp.x = 0;
  bmp.y = 0;
  bmp.z = 0;
  stage.addChild(bmp);
  stage.update();
  console.log('image loaded');
  stage.setChildIndex(bmp, bmp.z);
}

function resize(canvas) {
  const scale = 4;
  canvas.width = window.innerWidth / scale;
  canvas.height = window.innerHeight / scale;
}

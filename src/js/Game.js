import { Tilemap } from './Tilemap.js';
import tileset from '@/assets/tiles/dungeonTileset.png';
const createjs = window.createjs;

const circle = new createjs.Shape();
const cameraContainer = new createjs.Container();
cameraContainer.snapToPixel = true;
cameraContainer.snapToPixelEnabled = true;
const camera = {
  x: 0,
  y: 0,
  scale: 4
}

class Pointer {
  constructor(threshold = 10) {
    this.threshold = threshold;
    this.x = 0;
    this.y = 0;
    this.leftClick = false;
  }

  mousedown(e) {
    this.leftClick = true;
    this.x = e.clientX;
    this.y = e.clientY;
  }

  mousemove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }

  mouseup(e) {
    this.leftClick = false;
  }

  isClick(e) {
    console.log('isclick: ', this.x, this.y);
    const deltaX = Math.abs(e.clientX - this.x);
    const deltaY = Math.abs(e.clientY - this.y);
    return deltaX < this.threshold && deltaY < this.threshold;
  }
}

const pointer = new Pointer();

window.addEventListener('mousedown', (e) => pointer.mousedown(e))
window.addEventListener('mouseup', (e) => pointer.mouseup(e))
window.addEventListener('mousemove', (e) => {
  if (pointer.leftClick) {
    camera.x += (e.clientX - pointer.x) / camera.scale;
    camera.y += (e.clientY - pointer.y) / camera.scale;
  }
  pointer.mousemove(e);
});

export function init() {
  const stage = new createjs.Stage('gameCanvas');
  stage.snapToPixel = true;
  stage.snapToPixelEnabled = true;

  window.addEventListener('resize', () => resize(stage.canvas));
  window.addEventListener('wheel', (event) => {
    if (event.deltaY > 0) {
      camera.scale *= 0.9;
    } else {
      camera.scale *= 1.1;
    }
    resize(stage.canvas);
  });
  resize(stage.canvas);

  circle.graphics.beginFill('DeepSkyBlue').drawCircle(0, 0, 50);
  circle.x = 10;
  circle.y = 10;
  circle.z = 100;
  // stage.addChild(circle);
  cameraContainer.addChild(circle);
  stage.addChild(cameraContainer);

  loadImage(stage);
  stage.update();
  window.requestAnimationFrame((dt) => loop(dt, stage));
}

function loop(dt, stage) {
  const context = stage.canvas.getContext('2d');
  context.imageSmoothingEnabled = false;

  stage.update();
  cameraContainer.snapToPixel = true;
  cameraContainer.snapToPixelEnabled = true;

  cameraContainer.x = camera.x;
  cameraContainer.y = camera.y;
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
  cameraContainer.addChild(bmp);
  console.log('image loaded');
  cameraContainer.setChildIndex(bmp, bmp.z);
}

function resize(canvas) {
  canvas.width = window.innerWidth / camera.scale;
  canvas.height = window.innerHeight / camera.scale;
}

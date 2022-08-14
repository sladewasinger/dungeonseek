import { Tilemap } from './Tilemap.js';
import tileset from '@/assets/tiles/dungeonTileset.png';
import { GridDrawer } from './GridDrawer.js';
import { DungeonTileset } from './DungeonTileset.js';
const createjs = window.createjs;

const cameraContainer = new createjs.Container();
// cameraContainer.snapToPixel = true;
// cameraContainer.snapToPixelEnabled = true;
const camera = {
  x: 0,
  y: 0,
  scale: 1
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

const assets = [];

function handleFileLoad(event) {
  assets.push(event);
}

let spriteSheet;

function handleComplete() {
  for (let i = 0; i < assets.length; i++) {
    const event = assets[i];
    const result = event.result;
    console.log(result);

    switch (event.item.id) {
      case 'sheet1':
        spriteSheet = result;
        break;
    }
  }

  initScene();
}

function initScene() {
  const container = new createjs.Container();

  for (let i = 0; i < 5; i++) {
    const floor = new createjs.Sprite(spriteSheet, 'wall_mid');
    floor.x = i * 16;
    floor.y = 8;
    container.addChild(floor);
  }
  cameraContainer.addChild(container);
  setTimeout(() => cameraContainer.removeChild(container), 2000);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener('tick', stage);
}

let stage = null;
export function init() {
  stage = new createjs.Stage('gameCanvas');
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

  stage.addChild(cameraContainer);

  const manifest = [
    { src: 'media/dungeon_tiles/dungeonTileset.json', id: 'sheet1', type: 'spritesheet' }
  ];

  const loader = new createjs.LoadQueue(true, './');
  loader.on('fileload', handleFileLoad);
  loader.on('complete', handleComplete);
  loader.loadManifest(manifest);
  // loadImage(stage);

  // window.requestAnimationFrame((dt) => loop(dt, stage));
  const context = stage.canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  createjs.Ticker.on('tick', (event) => loop(event, stage));
}

function loop(event, stage) {
  stage.update(event);
  cameraContainer.snapToPixel = true;
  cameraContainer.snapToPixelEnabled = true;

  cameraContainer.x = camera.x;
  cameraContainer.y = camera.y;
  // window.requestAnimationFrame((dt) => loop(dt, stage));
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
  // cameraContainer.addChild(bmp);
  console.log('image loaded');
  cameraContainer.setChildIndex(bmp, bmp.z);

  console.log(bmp);
  const gridDrawer = new GridDrawer(stage, cameraContainer, 16, bmp.image.width, bmp.image.height);
  const dungeonTileset = new DungeonTileset(16, bmp);

  const data = {
    images: [event.result],
    frames: { width: event.result.width, height: event.result.height },
    animations: {
    }
  };
  const spriteSheet = new createjs.SpriteSheet(data);
  // cameraContainer.addChild(spriteSheet);
}

function resize(canvas) {
  canvas.width = window.innerWidth / camera.scale;
  canvas.height = window.innerHeight / camera.scale;
}

import { Tilemap } from './Tilemap.js';
import tileset from '@/assets/tiles/dungeonTileset.png';
import { GridDrawer } from './GridDrawer.js';
import { DungeonTileset } from './DungeonTileset.js';
import { Point, Rectangle } from './Shapes.js';
import { MousePointer } from './MousePointer';
import { Camera } from './Camera';
import { Engine } from './Engine.js';

export const createjs = window.createjs;

const camera = new Camera();

const pointer = new MousePointer(camera);

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
let bigDemon;
function handleComplete(event) {
  console.log(event);

  for (let i = 0; i < assets.length; i++) {
    const event = assets[i];
    const result = event.result;
    console.log(result);

    switch (event.item.id) {
      case 'sheet1':
        spriteSheet = result;
        break;
      case 'bigDemon':
        bigDemon = result;
        break;
    }
  }

  initScene();
}

let demon = null;
function initScene() {
  const container = new createjs.Container();
  for (let i = 0; i < 25; i++) {
    const floor = new createjs.Sprite(spriteSheet, 'wall_mid');
    floor.x = i * 16;
    floor.y = 100;
    container.addChild(floor);
  }
  demon = new createjs.Sprite(bigDemon, 'big_demon_idle_anim');
  let run = false;
  setInterval(() => {
    run = !run;
    if (run) {
      demon.scaleX = -1;
      demon.gotoAndPlay('big_demon_run_anim');
    } else {
      demon.scaleX = 1;
      demon.gotoAndPlay('big_demon_idle_anim');
    }
  }, 2000);
  demon.x = 50;
  demon.y = 50;
  container.addChild(demon);
  camera.container.addChild(container);
}

export function init() {
  const engine = new Engine();
  engine.init();
}

let stage = null;
export function initOld() {
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

  stage.addChild(camera.container);

  const manifest = [
    { src: 'media/dungeon_tiles/dungeonTileset.json', id: 'sheet1', type: 'spritesheet' },
    { src: 'media/dungeon_tiles/demon2.json', id: 'bigDemon', type: 'spritesheet' }
  ];

  const loader = new createjs.LoadQueue(true, './');
  loader.on('fileload', handleFileLoad);
  loader.on('complete', handleComplete);
  loader.loadManifest(manifest);
  // loadImage(stage);

  // window.requestAnimationFrame((dt) => loop(dt, stage));
  const context = stage.canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on('tick', (event) => loop(event, stage));
}

function loop(event, stage) {
  stage.update(event);
  camera.container.snapToPixel = true;
  camera.container.snapToPixelEnabled = true;

  camera.container.x = camera.x;
  camera.container.y = camera.y;

  if (demon != null) {
    demon.x = pointer.canvasX;
    demon.y = pointer.canvasY
  }

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
  // camera.container.addChild(bmp);
  console.log('image loaded');
  camera.container.setChildIndex(bmp, bmp.z);

  console.log(bmp);
  const gridDrawer = new GridDrawer(stage, camera.container, 16, bmp.image.width, bmp.image.height);
  const dungeonTileset = new DungeonTileset(16, bmp);

  const data = {
    images: [event.result],
    frames: { width: event.result.width, height: event.result.height },
    animations: {
    }
  };
  const spriteSheet = new createjs.SpriteSheet(data);
  // camera.container.addChild(spriteSheet);
}

function resize(canvas) {
  canvas.width = window.innerWidth / camera.scale;
  canvas.height = window.innerHeight / camera.scale;
}

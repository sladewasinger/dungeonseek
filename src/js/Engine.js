import { MousePointer } from './MousePointer';
import { Camera } from './Camera';
import { Sprite, PlayerSprite } from './Sprite';
import { RectangleCollision } from './Collision';
import { Rectangle } from './Shapes';
import { gravity, friction } from './Constants.js';

const createjs = window.createjs;

const dungeonSheetSrc = { src: 'media/dungeon_tiles/dungeonTileset.json', id: 'dungeonsheet', type: 'spritesheet' };
const demonSrc = { src: 'media/dungeon_tiles/demon2.json', id: 'bigDemon', type: 'spritesheet' };
const manifest = [
  dungeonSheetSrc,
  demonSrc
];

export class Engine {
  constructor() {
    this.camera = new Camera(0, 0, 3);
    this.pointer = new MousePointer(this.camera);
    this.assets = [];
    this.spriteSheet = null;
    this.player = null;
    this.sprites = [];
    this.keyMap = {};

    this.stage = new createjs.Stage('gameCanvas');
    this.stage.snapToPixel = true;
    this.stage.snapToPixelEnabled = true;
    this.stage.addChild(this.camera.container);

    const context = this.stage.canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    window.addEventListener('resize', e => this.resizeCanvas());
    window.addEventListener('wheel', e => this.resizeCanvas());

    window.addEventListener('keydown', e => {
      this.keyMap[e.key] = true;
    });
    window.addEventListener('keyup', e => {
      this.keyMap[e.key] = false;
    });

    const loader = new createjs.LoadQueue(true, './');
    loader.on('fileload', this.handleFileLoad.bind(this));
    loader.on('complete', this.handleComplete.bind(this));
    loader.loadManifest(manifest);

    this.i = 0;
  }

  update(event) {
    if (this.keyMap.ArrowUp) {
      this.playerSprite.velocity.y = -1;
    }
    if (this.keyMap.ArrowDown) {
      this.playerSprite.velocity.y = 1;
    }
    if (this.keyMap.ArrowLeft) {
      this.playerSprite.velocity.x = -0.5;
    }
    if (this.keyMap.ArrowRight) {
      this.playerSprite.velocity.x = 0.5;
    }

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      sprite.update();

      if (sprite.gravity) {
        sprite.velocity.y += gravity;
      }
      sprite.velocity.x *= friction;
      let overlapX = false;
      let overlapY = false;

      for (let j = i + 1; j < this.sprites.length; j++) {
        if (i === j) {
          continue;
        }

        if (sprite.velocity.x === 0 && sprite.velocity.y === 0) {
          continue;
        }

        const spritej = this.sprites[j];
        const newPosX = new Rectangle(sprite.x + sprite.velocity.x - sprite.width / 2, sprite.y - sprite.height / 2, sprite.width, sprite.height);
        const newPosY = new Rectangle(sprite.x - sprite.width / 2, sprite.y + sprite.velocity.y - sprite.height / 2, sprite.width, sprite.height);
        const posJ = new Rectangle(spritej.x - spritej.width / 2, spritej.y - spritej.height / 2, spritej.width, spritej.height);

        if (RectangleCollision.checkOverlap(newPosX, posJ)) {
          overlapX = true;
        }

        if (RectangleCollision.checkOverlap(newPosY, posJ)) {
          overlapY = true;
        }
      }

      /* TODO: Figure out point of collision and adjust position accordingly */
      if (!overlapX) {
        sprite.x += sprite.velocity.x;
      } else {
        sprite.velocity.x = 0;
      }

      if (!overlapY) {
        sprite.y += sprite.velocity.y;
      } else {
        sprite.velocity.y = 0;
      }
    }

    this.camera.container.x = this.camera.x;
    this.camera.container.y = this.camera.y;

    this.stage.update(event);
  }

  init() {
    this.resizeCanvas();

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on('tick', this.update.bind(this));
  }

  initScene() {
    for (let i = 0; i < 25; i++) {
      const floor = new Sprite(this.spriteSheet, 'wall_mid', this.camera.container, 16, 16);
      floor.x = i * 16;
      floor.y = 100;
      floor.gravity = false;
      this.sprites.push(floor);
    }

    const floor = new Sprite(this.spriteSheet, 'wall_mid', this.camera.container, 16, 16);
    floor.x = 200;
    floor.y = 75;
    floor.gravity = false;
    this.sprites.push(floor);
  }

  handleFileLoad(event) {
    this.assets.push(event);
  }

  handleComplete(event) {
    for (let i = 0; i < this.assets.length; i++) {
      const event = this.assets[i];
      const result = event.result;

      switch (event.item.id) {
        case dungeonSheetSrc.id:
          this.spriteSheet = result;
          break;
        case demonSrc.id:
          this.playerSprite = new PlayerSprite(result, 'big_demon_idle_anim', this.camera.container, 18, 26, 0, 6);
          this.playerSprite.x = 100;
          this.playerSprite.y = 40;
          this.sprites.push(this.playerSprite);
          break;
      }
    }

    this.initScene();
  }

  resizeCanvas() {
    this.stage.canvas.width = window.innerWidth / this.camera.scale;
    this.stage.canvas.height = window.innerHeight / this.camera.scale;
  }
}

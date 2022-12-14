import { MousePointer } from './MousePointer';
import { Camera } from './Camera';
import { Sprite, PlayerSprite, WallTopMid } from './Sprite';
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
    this.camera = new Camera(0, 0, 2);
    this.pointer = new MousePointer(this.camera);
    this.assets = [];
    this.spriteSheet = null;
    this.playerSpriteSheet = null;
    this.player = null;
    this.sprites = [];
    this.keyMap = {};
    this.canJump = true;
    this.lastUpdatedTimeMs = 0;

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
          this.playerSpriteSheet = result;
          break;
      }
    }

    this.initScene();
  }

  resizeCanvas() {
    this.stage.canvas.width = window.innerWidth / this.camera.scale;
    this.stage.canvas.height = window.innerHeight / this.camera.scale;
  }

  update(event) {
    const dt = event.delta / (1000 / 120);

    if (this.keyMap.ArrowUp && this.canJump) {
      this.playerSprite.velocity.y = -2;
      this.canJump = false;
    }
    if (this.keyMap.ArrowDown) {
      this.playerSprite.velocity.y = 2;
    }
    if (this.keyMap.ArrowLeft) {
      this.playerSprite.scaleX = -1;
      this.playerSprite.velocity.x = -1;
    }
    if (this.keyMap.ArrowRight) {
      this.playerSprite.scaleX = 1;
      this.playerSprite.velocity.x = 1;
    }

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i];
      sprite.update();

      if (sprite.gravity) {
        sprite.velocity.y += gravity * dt;
      }
      sprite.velocity.x *= friction * dt;
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
          if (sprite === this.playerSprite) {
            this.canJump = true;
          }
        }
      }

      /* TODO: Figure out point of collision and adjust position accordingly */
      if (!overlapX) {
        sprite.x += sprite.velocity.x * dt;
      } else {
        sprite.velocity.x = 0;
      }

      if (!overlapY) {
        sprite.y += sprite.velocity.y * dt;
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
    createjs.Ticker.on('tick', (e) => this.update(e));
  }

  initScene() {
    const grid = [];
    const cellSize = 32;

    for (let i = 0; i < 25; i++) {
      const wallTopMid = new WallTopMid(this.spriteSheet, this.camera.container, 16, 16);
      wallTopMid.x = Math.random(0) * 500;
      wallTopMid.y = Math.random(0) * 500;
      wallTopMid.gravity = false;
      this.sprites.push(wallTopMid);
    }

    const floor = new Sprite(this.spriteSheet, 'wall_mid', this.camera.container, 16, 16);
    floor.x = 200;
    floor.y = 75;
    floor.gravity = false;
    this.sprites.push(floor);

    this.playerSprite = new PlayerSprite(this.playerSpriteSheet, 'big_demon_idle_anim', this.camera.container, 18, 26, 0, 5);
    this.playerSprite.x = 100;
    this.playerSprite.y = 40;
    this.sprites.push(this.playerSprite);
  }
}

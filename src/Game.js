export default class Game {
  constructor(ctx, w, h, char_size, tiles, player) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.char_size = char_size;
    this.ROWS = this.h / this.char_size;
    this.COLS = this.w / this.char_size;
    this.tiles = tiles;
    this.player = player;
    this.keys = [];
  }

  layers = [
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  ];

  update() {
    this.player.update();
  }

  isSolidTile = (x, y) => {
    const startTileX = Math.floor(y / 64);
    const startTileY = Math.floor(x / 64);
    return this.layers[0][startTileX][startTileY] === 1;
  };

  init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    if (this.keys["KeyD"]) {
      this.player.dirx = 1;
    } else if (this.keys["KeyA"]) {
      this.player.dirx = -1;
    } else {
      this.player.dirx = 0;
    }

    if (this.keys["KeyW"]) {
      this.player.diry = -1;
    } else if (this.keys["KeyS"]) {
      this.player.diry = 1;
    } else {
      this.player.diry = 0;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (let j = 0; j < this.ROWS; j++) {
        for (let k = 0; k < this.COLS; k++) {
          const imageType = layer[j][k];
          this.ctx.drawImage(
            this.tiles[imageType],
            k * this.char_size,
            j * this.char_size,
            this.char_size,
            this.char_size
          );
        }
      }
    }

    this.player.draw();
  }
}

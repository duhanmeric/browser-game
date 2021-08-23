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
    console.log(x,y,startTileX, startTileY);
    return this.layers[0][startTileX][startTileY] === 1;
  };

  init() {
    window.addEventListener("keydown", (e) =>
      this.onKeyDown(e, this.player, this.w)
    );
    window.addEventListener("keyup", (e) => this.onKeyUp(e, this.player));
  }

  onKeyUp(e, player) {
    if (e.code === "KeyW" || e.code === "KeyS") {
      player.diry = 0;
    }

    if (e.code === "KeyA" || e.code === "KeyD") {
      player.dirx = 0;
    }
  }

  onKeyDown(e, player, w) {
    if (e.code === "KeyW") {
      player.diry = -1;
    }
    if (e.code === "KeyS") {
      player.diry = 1;
    }
    if (e.code === "KeyD") {
      player.dirx = 1;
    }
    if (e.code === "KeyA") {
      player.dirx = -1;
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

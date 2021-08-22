export default class Player {
  constructor(ctx, w, h, char_size, playerImg) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.char_size = char_size;
    this.playerImg = playerImg;
    this.x = this.w / 2 - this.char_size / 2;
    this.y = this.h / 2 - this.char_size / 2;
    this.dirx = 0;
    this.diry = 0;
  }

  draw() {
    this.ctx.drawImage(
      this.playerImg,
      this.x,
      this.y,
      this.char_size,
      this.char_size
    );
  }

  update() {
    this.x += this.dirx * 2;
    this.y += this.diry * 2;
  }
}

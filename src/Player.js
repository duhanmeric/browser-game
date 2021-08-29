export default class Player {
  constructor(ctx, w, h, char_size, playerImg) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.char_size = char_size;
    this.playerImg = playerImg;
    this.x = this.w / 2;
    this.y = this.h / 2;
    this.dirx = 0;
    this.diry = 0;
    this.targetX = this.w / 2;
    this.targetY = this.h / 2;
  }

  draw() {
    this.ctx.drawImage(
      this.playerImg,
      this.x - 32,
      this.y - 32,
      this.char_size,
      this.char_size
    );
  }

  update() {
    var targetX = this.targetX + this.dirx * 3;
    var targetY = this.targetY + this.diry * 3;

    if (!this.game.isSolidTile(targetX, targetY)) {
      this.targetX = targetX;
      this.targetY = targetY;
      this.x = this.x + (this.targetX - this.x) * 0.4;
      this.y = this.y + (this.targetY - this.y) * 0.4;
    }
  }
}

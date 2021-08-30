export default class Projectile {
  constructor(ctx, TILE_WIDTH, fireImg) {
    this.ctx = ctx;
    this.TILE_WIDTH = TILE_WIDTH;
    this.fireImg = fireImg;
  }

  draw() {
    this.ctx.drawImage(
      this.fireImg,
      this.fireX - 32,
      this.fireY - 32,
      this.TILE_WIDTH,
      this.TILE_WIDTH
    );
  }
}

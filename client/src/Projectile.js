export default class Projectile {
  constructor(ctx, TILE_WIDTH, fireImg) {
    this.ctx = ctx;
    this.TILE_WIDTH = TILE_WIDTH;
    this.fireImg = fireImg;
  }

  draw() {
    this.ctx.drawImage(
      this.fireImg,
      this.fireX,
      this.fireY,
      this.TILE_WIDTH,
      this.TILE_WIDTH
    );
  }
}

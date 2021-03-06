export default class Hp {
  constructor(ctx, TILE_WIDTH, hpImg) {
    this.ctx = ctx;
    this.TILE_WIDTH = TILE_WIDTH;
    this.hpImg = hpImg;
  }

  draw() {
    this.ctx.drawImage(
      this.hpImg,
      this.x,
      this.y,
      this.TILE_WIDTH,
      this.TILE_WIDTH
    );
  }
}

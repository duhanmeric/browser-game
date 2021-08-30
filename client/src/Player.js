export default class Player {
  constructor(ctx, w, h, TILE_WIDTH, playerImg, fireImg) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.TILE_WIDTH = TILE_WIDTH;
    this.playerImg = playerImg;
    this.fireImg = fireImg;
    this.id = 0;
    this.name = "";
    this.health = 0; // server override
    this.isDead = false; // server override
  }

  draw() {
    if (!this.isDead) {
      this.ctx.drawImage(
        this.playerImg,
        this.x,
        this.y,
        this.TILE_WIDTH,
        this.TILE_WIDTH
      );

      // this.ctx.font = "16px Arial";
      // this.ctx.textAlign = "center";
      // this.ctx.fillStyle = "white";
      // this.ctx.fillText(this.name, this.x + this.TILE_WIDTH / 2, this.y + 6);

      this.ctx.fillStyle = "red";
      this.ctx.fillRect(
        this.x + this.TILE_WIDTH / 4,
        this.y + this.TILE_WIDTH - 14,
        (this.TILE_WIDTH / 2) * (this.health / 100),
        12
      );
    }
  }
}

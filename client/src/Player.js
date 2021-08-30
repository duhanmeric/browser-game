export default class Player {
  constructor(ctx, w, h, char_size, playerImg, fireImg) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.char_size = char_size;
    this.playerImg = playerImg;
    this.fireImg = fireImg;
    this.id = 0;
    this.name = "";
  }

  draw() {
    this.ctx.drawImage(
      this.playerImg,
      this.x - 32,
      this.y - 32,
      this.char_size,
      this.char_size
    );

    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.name, this.x, this.y - 25);
  }
}

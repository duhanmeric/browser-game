export default class Projectile {
  constructor(ctx, char_size, fireImg) {
    this.ctx = ctx;
    this.char_size = char_size;
    this.fireImg = fireImg;
  }

  draw() {
    this.ctx.drawImage(
      this.fireImg,
      this.fireX - 32,
      this.fireY - 32,
      this.char_size,
      this.char_size
    );
  }
}

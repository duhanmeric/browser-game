export default class Projectile {
  constructor(ctx, fireX, fireY, char_size, fireImg, velocity) {
    this.ctx = ctx;
    this.fireX = fireX;
    this.fireY = fireY;
    this.char_size = char_size;
    this.fireImg = fireImg;
    this.velocity = velocity;
  }

  draw() {
    this.ctx.drawImage(
      this.fireImg,
      this.fireX - 32,
      this.fireY - 32,
      this.char_size,
      this.char_size
    );

    this.fireX = this.fireX + this.velocity.x * 5;
    this.fireY = this.fireY + this.velocity.y * 5;
  }
}

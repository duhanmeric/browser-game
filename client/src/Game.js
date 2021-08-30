import Player from "./Player";
import Projectile from "./Projectile";

export default class Game {
  constructor(
    ctx,
    w,
    h,
    char_size,
    tiles,
    socket,
    playerImg,
    fireImg,
    username
  ) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.char_size = char_size;
    this.ROWS = this.h / this.char_size;
    this.COLS = this.w / this.char_size;
    this.tiles = tiles;
    this.keys = [];
    this.players = [];
    this.layers = [];
    this.projectiles = [];
    this.playerImg = playerImg;
    this.fireImg = fireImg;
    this.username = username;
    this.socket = socket;

    socket.on("PLAYERS_UPDATE", (players) => {
      const newPlayers = [];
      for (let i = 0; i < players.length; i++) {
        const newPlayer = new Player(
          ctx,
          this.w,
          this.h,
          64,
          this.playerImg,
          this.fireImg
        );
        newPlayer.id = players[i].id;
        newPlayer.name = players[i].name;
        newPlayer.x = players[i].x;
        newPlayer.y = players[i].y;
        newPlayers.push(newPlayer);
      }
      this.players = newPlayers;
    });

    socket.on("FIRE_UPDATE", (projectiles) => {
      const newProjectiles = [];
      for (let i = 0; i < projectiles.length; i++) {
        const newProjectile = new Projectile(ctx, 32, this.fireImg);
        newProjectile.id = projectiles[i].id;
        newProjectile.fireX = projectiles[i].fireX + 16;
        newProjectile.fireY = projectiles[i].fireY + 16;
        newProjectiles.push(newProjectile);
      }
      this.projectiles = newProjectiles;
    });

    socket.on("LAYERS_UPDATE", (layers) => {
      this.layers = layers;
    });
  }

  update() {}

  init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });

    if (this.keys["KeyD"]) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", { dirx: 1 });
    } else if (this.keys["KeyA"]) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", { dirx: -1 });
    } else {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", { dirx: 0 });
    }

    if (this.keys["KeyW"]) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", { diry: -1 });
    } else if (this.keys["KeyS"]) {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", { diry: 1 });
    } else {
      this.socket.emit("PLAYER_DIRECTION_UPDATE", { diry: 0 });
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

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      player.draw();
    }

    if (this.projectiles.length > 0) {
      this.projectiles.forEach((p) => {
        p.draw();
      });
    }

    // ekrandan cikan mermileri silme
    this.projectiles.forEach((p, index) => {
      if (p.fireX > this.w || p.fireX < 0 || p.fireY < 0 || p.fireY > this.h) {
        this.projectiles.splice(index, 1);
        this.socket.emit("DELETE_PROJECTILE", p);
      }
    });
  }
}

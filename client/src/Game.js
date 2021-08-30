import Hp from "./HP";
import Player from "./Player";
import Projectile from "./Projectile";

export default class Game {
  constructor(
    ctx,
    w,
    h,
    TILE_WIDTH,
    tiles,
    socket,
    playerImg,
    fireImg,
    hpImg,
    username
  ) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
    this.TILE_WIDTH = TILE_WIDTH;
    this.ROWS = this.h / this.TILE_WIDTH;
    this.COLS = this.w / this.TILE_WIDTH;
    this.tiles = tiles;
    this.keys = [];
    this.players = [];
    this.layers = [];
    this.projectiles = [];
    this.hpPotions = [];
    this.playerImg = playerImg;
    this.fireImg = fireImg;
    this.hpImg = hpImg;
    this.username = username;
    this.socket = socket;

    socket.on("PLAYERS_UPDATE", (players) => {
      const newPlayers = [];
      for (let i = 0; i < players.length; i++) {
        const newPlayer = new Player(
          ctx,
          this.w,
          this.h,
          this.TILE_WIDTH,
          this.playerImg,
          this.fireImg
        );
        newPlayer.id = players[i].id;
        newPlayer.name = players[i].name;
        newPlayer.x = players[i].x;
        newPlayer.y = players[i].y;
        newPlayer.health = players[i].health;
        newPlayer.isDead = players[i].isDead;
        newPlayers.push(newPlayer);
      }
      this.players = newPlayers;
    });

    socket.on("FIRE_UPDATE", (projectiles) => {
      const newProjectiles = [];
      for (let i = 0; i < projectiles.length; i++) {
        const newProjectile = new Projectile(
          ctx,
          this.TILE_WIDTH / 2,
          this.fireImg
        );
        newProjectile.id = projectiles[i].id;
        newProjectile.fireX = projectiles[i].fireX + this.TILE_WIDTH / 4;
        newProjectile.fireY = projectiles[i].fireY + this.TILE_WIDTH / 4;
        newProjectiles.push(newProjectile);
      }
      this.projectiles = newProjectiles;
    });

    socket.on("HP_POTION_UPDATE", (hpPotions) => {
      const newHpPotions = [];
      for (let i = 0; i < hpPotions.length; i++) {
        const newHpPotion = new Hp(ctx, this.TILE_WIDTH / 4, this.hpImg);
        newHpPotion.x = hpPotions[i].x + this.TILE_WIDTH / 4;
        newHpPotion.y = hpPotions[i].y + this.TILE_WIDTH / 4;
        newHpPotions.push(newHpPotion);
      }
      this.hpPotions = newHpPotions;
    });

    socket.on("GAME_STATE_UPDATE", (state) => {
      this.gameOver = state.gameOver;
      this.winnerId = state.winnerId;
    });

    socket.on("LAYERS_UPDATE", (layers) => {
      this.layers = layers;
    });
  }

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
    if (this.gameOver) {
      const winner = this.players.find((player) => player.id === this.winnerId);
      this.ctx.font = "normal 42px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillStyle = "white";
      if (winner) {
        this.ctx.fillText(`KAZANAN ${winner.name}`, this.w / 2, this.h / 2);
      }
      return;
    }
    this.ctx.clearRect(0, 0, this.w, this.h);

    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (let j = 0; j < this.ROWS; j++) {
        for (let k = 0; k < this.COLS; k++) {
          const imageType = layer[j][k];
          this.ctx.drawImage(
            this.tiles[imageType],
            k * this.TILE_WIDTH,
            j * this.TILE_WIDTH,
            this.TILE_WIDTH,
            this.TILE_WIDTH
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

    if (this.hpPotions.length > 0) {
      this.hpPotions.forEach((h) => {
        h.draw();
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

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const PORT = 5000;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World! asdasd");
});

var Player = function (game, id) {
  this.game = game;
  this.id = id;
  this.x = Math.floor(Math.random() * (520 - 100)) + 100;
  this.y = Math.floor(Math.random() * (448 - 100)) + 100;
  this.dirx = 0;
  this.diry = 0;
  this.targetX = this.x;
  this.targetY = this.y;
  this.name = "";
  this.health = 100;
  this.width = 64;
  this.isDead = false;
};

Player.prototype.update = function update() {
  if (this.health < 0) {
    this.isDead = true;
  }
  var targetX = this.targetX + this.dirx * 3;
  var targetY = this.targetY + this.diry * 3;

  if (!this.game.isSolidTile(targetX, targetY)) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = this.x + (this.targetX - this.x) * 0.6;
    this.y = this.y + (this.targetY - this.y) * 0.6;
  }
};

var HpPotions = function HpPotions() {
  this.x = Math.floor(Math.random() * (640 - 128) + 50);
  this.y = Math.floor(Math.random() * (512 - 128) + 40);
  this.width = 16;
};

var Projectile = function Projectile(player, velocity) {
  this.id = player.id;
  this.width = 32;
  this.fireX = player.x + this.width / 2;
  this.fireY = player.y + this.width / 2;
  this.velocity = velocity;
};

Projectile.prototype.update = function update() {
  this.fireX = this.fireX + this.velocity.x * 4;
  this.fireY = this.fireY + this.velocity.y * 4;
};

var Game = function Game() {
  this.players = [];
  this.projectiles = [];
  this.hpPotions = [];
  this.layers = [
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  ];
  this.gameOver = false;
  this.winnerId = null;
  this.endedAt = null;
  this.lastPotionCreated = Date.now();
};

Game.prototype.addPlayer = function addPlayer(id) {
  this.players.push(new Player(this, id));
};

Game.prototype.addProjectile = function addProjectile(player, velocity) {
  this.projectiles.push(new Projectile(player, velocity));
};

Game.prototype.addHpPotions = function addHpPotions() {
  this.hpPotions.push(new HpPotions());
};

Game.prototype.isSolidTile = function isSolidTile(x, y) {
  const startTileX = Math.floor((y + 32) / 64);
  const startTileY = Math.floor((x + 32) / 64);
  return this.layers[0][startTileX][startTileY] === 1;
};

Game.prototype.reset = function reset() {
  this.players = [];
  this.projectiles = [];
  this.hpPotions = [];
  this.gameOver = false;
  this.winnerId = null;
};

Game.prototype.update = function update() {
  const alivePlayerCount = this.players.filter(
    (player) => !player.isDead
  ).length;

  const allPlayersCount = this.players.length;

  for (let i = 0; i < this.players.length; i++) {
    const player = this.players[i];

    if (alivePlayerCount === 1 && !player.isDead && allPlayersCount != 1) {
      this.winnerId = player.id;
      this.gameOver = true;
      this.endedAt = Date.now();
    }

    if (!this.gameOver) {
      player.update();
    }
  }

  for (let i = 0; i < this.projectiles.length; i++) {
    const projectile = this.projectiles[i];
    projectile.update();
  }

  for (let i = 0; i < this.players.length; i++) {
    const player = this.players[i];
    for (let j = 0; j < this.projectiles.length; j++) {
      if (player.id !== undefined && player.id !== this.projectiles[j].id) {
        if (
          player.x + 32 <
            this.projectiles[j].fireX + this.projectiles[j].width &&
          player.x + this.projectiles[j].width > this.projectiles[j].fireX &&
          player.y + 32 <
            this.projectiles[j].fireY + this.projectiles[j].width &&
          player.y + this.projectiles[j].width > this.projectiles[j].fireY
        ) {
          this.players[i].health -= 5;
          this.projectiles.splice(this.projectiles[j], 1);
        }
      }
    }
  }

  for (let i = 0; i < this.players.length; i++) {
    for (let j = 0; j < this.hpPotions.length; j++) {
      if (
        this.hpPotions[j].x + 32 < this.players[i].x + this.players[i].width &&
        this.hpPotions[j].x + this.hpPotions[j].width > this.players[i].x &&
        this.hpPotions[j].y + 32 < this.players[i].y + this.players[i].width &&
        this.hpPotions[j].y + this.hpPotions[j].width > this.players[i].y
      ) {
        if (this.players[i].health + 50 < 100) {
          this.players[i].health += 50;
        } else {
          this.players[i].health = 100;
        }
      }
    }
  }

  const now = Date.now();
  if (now - this.lastPotionCreated > 3000) {
    // this.addHpPotions();
    this.lastPotionCreated = Date.now();
  }
};

var game = new Game();

const interval = setInterval(() => {
  game.update();
}, 1000 / 60);

const updateInterval = setInterval(() => {
  io.sockets.emit(
    "PLAYERS_UPDATE",
    game.players.map((player) => ({
      id: player.id,
      name: player.name,
      x: player.x,
      y: player.y,
      health: player.health,
      isDead: player.isDead,
    }))
  );

  io.sockets.emit(
    "FIRE_UPDATE",
    game.projectiles.map((projectile) => ({
      id: projectile.id,
      fireX: projectile.fireX,
      fireY: projectile.fireY,
    }))
  );

  io.sockets.emit(
    "HP_POTION_UPDATE",
    game.hpPotions.map((hp) => ({
      x: hp.x,
      y: hp.y,
    }))
  );

  if (game.gameOver) {
    io.sockets.emit("GAME_STATE_UPDATE", {
      gameOver: game.gameOver,
      winnerId: game.winnerId,
    });
  }
}, 1000 / 60);

io.on("connection", (socket) => {
  console.log("user connected " + socket.id);
  game.addPlayer(socket.id);
  console.log("number of players " + game.players.length);

  setInterval(() => {
    if (game.gameOver) {
      socket.disconnect(true);
      if (Date.now() - game.endedAt > 1000) {
        game.reset();
      }
    }
  }, 1000 / 60);

  socket.emit("LAYERS_UPDATE", game.layers);

  socket.on("disconnect", function () {
    console.log("user disconnected " + socket.id);
    game.players = game.players.filter((player) => player.id !== socket.id);
    game.projectiles = game.projectiles.filter(
      (projectile) => projectile.id !== socket.id
    );
    console.log("number of players " + game.players.length);
  });

  socket.on("PLAYER_DIRECTION_UPDATE", function (data) {
    const player = game.players.filter((player) => player.id === socket.id);
    if (player[0] && !player[0].isDead) {
      if (data.dirx !== undefined) player[0].dirx = data.dirx;
      if (data.diry !== undefined) player[0].diry = data.diry;
    }
  });

  socket.on("PLAYER_NAME_UPDATE", function (data) {
    const player = game.players.filter((player) => player.id === socket.id);
    if (player[0]) {
      player[0].name = data.name;
    }
  });

  socket.on("PLAYER_FIRE", function (y, x) {
    const player = game.players.filter((player) => player.id === socket.id);
    if (player[0] && !player[0].isDead) {
      let angle = Math.atan2(y - (player[0].y + 32), x - (player[0].x + 32));
      let velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      game.addProjectile(player[0], velocity);
    }
  });

  socket.on("DELETE_PROJECTILE", function (data) {
    const projectile = game.projectiles.filter(
      (projectile) => projectile.id === data.id
    );
    game.projectiles.splice(projectile, 1);
  });
});

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

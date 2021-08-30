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
  this.x = 100;
  this.y = 100;
  this.dirx = 0;
  this.diry = 0;
  this.targetX = 100;
  this.targetY = 100;
  this.name = "";
};

Player.prototype.update = function update() {
  var targetX = this.targetX + this.dirx * 3;
  var targetY = this.targetY + this.diry * 3;

  if (!this.game.isSolidTile(targetX, targetY)) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.x = this.x + (this.targetX - this.x) * 0.6;
    this.y = this.y + (this.targetY - this.y) * 0.6;
  }
};

var Projectile = function Projectile(player, velocity) {
  this.id = player.id;
  this.fireX = player.x;
  this.fireY = player.y;
  this.velocity = velocity;
};

Projectile.prototype.update = function update() {
  this.fireX = this.fireX + this.velocity.x * 4;
  this.fireY = this.fireY + this.velocity.y * 4;
};

var Game = function Game() {
  this.players = [];
  this.projectiles = [];
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
};

Game.prototype.addPlayer = function addPlayer(id) {
  this.players.push(new Player(this, id));
};

Game.prototype.addProjectile = function addProjectile(player, velocity) {
  this.projectiles.push(new Projectile(player, velocity));
};

Game.prototype.isSolidTile = function isSolidTile(x, y) {
  const startTileX = Math.floor(y / 64);
  const startTileY = Math.floor(x / 64);
  return this.layers[0][startTileX][startTileY] === 1;
};

Game.prototype.update = function update() {
  for (let i = 0; i < this.players.length; i++) {
    const player = this.players[i];
    player.update();
  }

  for (let i = 0; i < this.projectiles.length; i++) {
    const projectile = this.projectiles[i];
    projectile.update();
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
    }))
  );

  io.sockets.emit(
    "FIRE_UPDATE",
    game.projectiles.map((projectile) => ({
      id: projectile.id,
      fireX: projectile.fireX,
      fireY: projectile.fireY,
      // velocity: projectile.velocity,
    }))
  );
}, 1000 / 60);

io.on("connection", (socket) => {
  console.log("user connected " + socket.id);
  game.addPlayer(socket.id);
  console.log("number of players " + game.players.length);

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
    if (data.dirx !== undefined) player[0].dirx = data.dirx;
    if (data.diry !== undefined) player[0].diry = data.diry;
  });

  socket.on("PLAYER_NAME_UPDATE", function (data) {
    const player = game.players.filter((player) => player.id === socket.id);
    player[0].name = data.name;
  });

  socket.on("PLAYER_FIRE", function (y, x) {
    const player = game.players.filter((player) => player.id === socket.id);
    let angle = Math.atan2(y - player[0].y, x - player[0].x);
    let velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    game.addProjectile(player[0], velocity);
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

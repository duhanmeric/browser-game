[1mdiff --git a/server.js b/server.js[m
[1mindex bf1b55d..3c12143 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -60,6 +60,7 @@[m [mvar Projectile = function Projectile(player, velocity) {[m
   this.fireX = player.x + this.width / 2;[m
   this.fireY = player.y + this.width / 2;[m
   this.velocity = velocity;[m
[32m+[m[32m  this.isOut = false;[m
 };[m
 [m
 Projectile.prototype.update = function update() {[m
[36m@@ -154,7 +155,8 @@[m [mGame.prototype.update = function update() {[m
           player.y + this.projectiles[j].width > this.projectiles[j].fireY[m
         ) {[m
           player.health -= 5;[m
[31m-          this.projectiles.splice(this.projectiles[j], 1);[m
[32m+[m[32m          this.projectiles[j].isOut = true;[m
[32m+[m[32m          this.projectiles = this.projectiles.filter((p) => !p.isOut);[m
         }[m
       }[m
     }[m
[36m@@ -175,7 +177,7 @@[m [mGame.prototype.update = function update() {[m
           player.health = 100;[m
         }[m
         this.hpPotions[j].collected = true;[m
[31m-        this.hpPotions = this.hpPotions.filter((p) => !p.collected);[m
[32m+[m[32m        this.hpPotions = this.hpPotions.filter((h) => !h.collected);[m
       }[m
     }[m
   }[m
[36m@@ -287,7 +289,11 @@[m [mio.on("connection", (socket) => {[m
     const projectile = game.projectiles.filter([m
       (projectile) => projectile.id === data.id[m
     );[m
[31m-    game.projectiles.splice(projectile, 1);[m
[32m+[m
[32m+[m[32m    if (projectile[0]) {[m
[32m+[m[32m      projectile[0].isOut = true;[m
[32m+[m[32m      game.projectiles = game.projectiles.filter((p) => !p.isOut);[m
[32m+[m[32m    }[m
   });[m
 });[m
 [m

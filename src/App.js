import { useEffect, useRef, useState } from "react";
import "./App.css";
import Game from "./Game";
import Player from "./Player";
import Projectile from "./Projectile";
import Ground from "./assets/ground.png";
import Edges from "./assets/edges.png";
import Wizard from "./assets/wizard.png";
import Fire from "./assets/fire.png";

const loadEnv = () => {
  let tempTiles = [Ground, Edges];
  let permTiles = [];

  for (let i = 0; i < tempTiles.length; i++) {
    let item = new Image();
    item.src = tempTiles[i];
    permTiles.push(item);
  }
  return permTiles;
};

function App() {
  const canvasRef = useRef();
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 512;
  let gameInt = useRef();
  const [tiles, setTiles] = useState(loadEnv);
  const [projectiles, setProjectiles] = useState([]);

  var player = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let tempArr = projectiles;

    let wizard = new Image();
    wizard.src = Wizard;

    let fire = new Image();
    fire.src = Fire;

    player.current = new Player(context, GAME_WIDTH, GAME_HEIGHT, 64, wizard);

    canvas.addEventListener("click", (e) => {
      const angle = Math.atan2(
        e.offsetY - player.current.y,
        e.offsetX - player.current.x
      );

      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      let projectile = new Projectile(
        context,
        player.current.x + 16,
        player.current.y + 16,
        32,
        fire,
        velocity
      );
      tempArr.push(projectile);
      setProjectiles(tempArr);
    });

    var game = new Game(
      context,
      GAME_WIDTH,
      GAME_HEIGHT,
      64,
      tiles,
      player.current,
      projectiles,
      setProjectiles
    );

    player.current.game = game;

    gameInt.current = setInterval(() => {
      game.init();
      game.draw();
      game.update();
    }, 1000 / 60);
  }, [tiles, projectiles]);

  return (
    <div className="app">
      <canvas
        id="game"
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
      ></canvas>
    </div>
  );
}

export default App;

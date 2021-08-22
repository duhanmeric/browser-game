import { useEffect, useRef, useState } from "react";
import "./App.css";
import Game from "./Game";
import Player from "./Player";
import Ground from "./assets/ground.png";
import Edges from "./assets/edges.png";
import Wizard from "./assets/wizard.png";

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

  var player = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let wizard = new Image();
    wizard.src = Wizard;
    player.current = new Player(context, GAME_WIDTH, GAME_HEIGHT, 64, wizard);

    var game = new Game(context, GAME_WIDTH, GAME_HEIGHT, 64, tiles, player.current);

    gameInt.current = setInterval(() => {
      game.init();
      game.draw();
      game.update();
    }, 1000 / 120);
  }, [tiles]);

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

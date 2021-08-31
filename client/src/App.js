import { useEffect, useRef, useState } from "react";
import "./App.css";
import Game from "./Game";
import Ground from "./assets/ground.png";
import Edges from "./assets/edges.png";
import Wizard from "./assets/wizard.png";
import Fire from "./assets/fire.png";
import HP from "./assets/hp_potion.png";
import Login from "./Login";
import { io } from "socket.io-client";

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
  const [scene, setScene] = useState(0);
  const [userName, setUserName] = useState("");

  const canvasRef = useRef();
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 512;
  const FPS = 1000 / 60;
  const TILE_WIDTH = 64;
  let gameInt = useRef();
  const [tiles, setTiles] = useState(loadEnv);

  useEffect(() => {
    if (scene === 1) {
      var socket = io("https://cerezroyale.herokuapp.com/");
      socket.on("disconnect", () => {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      });
      socket.emit("PLAYER_NAME_UPDATE", { name: userName });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      let wizard = new Image();
      wizard.src = Wizard;

      let fire = new Image();
      fire.src = Fire;

      let hp = new Image();
      hp.src = HP;

      var game = new Game(
        context,
        GAME_WIDTH,
        GAME_HEIGHT,
        TILE_WIDTH,
        tiles,
        socket,
        wizard,
        fire,
        hp,
        userName
      );

      canvas.addEventListener("click", (e) => {
        socket.emit("PLAYER_FIRE", e.offsetY, e.offsetX);
      });

      gameInt.current = setInterval(() => {
        game.init();
        game.draw();
      }, FPS);
    }
  }, [tiles, scene, userName, FPS]);

  return (
    <div className="app">
      {scene === 0 ? (
        <Login
          userName={userName}
          setUserName={setUserName}
          setScene={setScene}
        ></Login>
      ) : (
        <canvas
          id="game"
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
        ></canvas>
      )}
    </div>
  );
}

export default App;

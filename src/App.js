import { useEffect, useRef } from "react";
import "./App.css";
import Game from "./Game"
import Ground from "./assets/ground.png"
import Edges from "./assets/edges.png"

function App() {
  const canvasRef = useRef();
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 512;

  let gameInt = useRef();


  useEffect(() => {
    let ground = new Image();
    ground.src = Ground;
    let edges = new Image();
    edges.src = Edges;
    const tiles = [ground, edges];
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    var game = new Game(context, GAME_WIDTH, GAME_HEIGHT, tiles)

    gameInt.current = setInterval(() => {
      game.clearRect(context, canvas.width, canvas.height);
      game.draw();
    }, 1000/1);

  }, [])


  return (
    <div className="app">
      <canvas id="game" ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT}></canvas>
    </div>
  );
}

export default App;

import { Canvas } from "@react-three/fiber";
import Game, { GameState } from "./Game";
import { useState } from "react";

function App() {
    const [gameState, setGameState] = useState(GameState.Done);

    return (
        <div className="h-screen overflow-hidden" style={{ backgroundColor: "#484954" }}>
            <div className="flex justify-center" style={{ transform: 'translate(3.4rem, 0)' }}>
                <div className="text-5xl text-white font-bold text-center my-4 tracking-wider" style={{ textShadow: "4px 4px 5px #558ABB" }}>
                    TetraCube
                </div>
                <button className={`${gameState !== GameState.Done ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"} w-20 text-white font-bold my-4 ml-5 px-5 rounded`} onClick={() => setGameState(gameState !== GameState.Done ? GameState.Done : GameState.Ongoing)}>
                    {gameState !== GameState.Done ? 'Quit': 'Start'}
                </button>
                <button className={`bg-orange-500 hover:bg-orange-700 w-24 text-white font-bold my-4 ml-5 px-5 rounded ${gameState !== GameState.Done ? 'visible' : 'invisible'}`} onClick={() => setGameState(gameState === GameState.Ongoing ? GameState.Paused : GameState.Ongoing)}>
                    {gameState === GameState.Ongoing ? 'Pause' : 'Resume'}
                </button>
            </div>
            <Canvas camera={{ fov: 30 }} shadows>
                <Game state={gameState} />
            </ Canvas >
        </div>
    );
}

export default App;

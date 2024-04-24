import { Canvas } from "@react-three/fiber";
import Game from "./Game";
import { useState } from "react";

const GameState = {
    Ongoing: 'Ongoing',
    Done: 'Done'
};

function App() {
    const [gameState, setGameState] = useState(GameState.Done);

    return (
        <div className="h-screen overflow-hidden" style={{ backgroundColor: "#484954" }}>
            <div className="flex justify-center">
                <div className="text-5xl text-white font-bold text-center my-4 tracking-wider" style={{ textShadow: "4px 4px 5px #558ABB" }}>
                    TetraCube
                </div>
                <button className={`${gameState === GameState.Ongoing ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"} text-white font-bold my-4 ml-5 px-5 rounded`} onClick={() => setGameState(gameState === GameState.Ongoing ? GameState.Done : GameState.Ongoing)}>
                    {gameState === GameState.Done ? 'Start' : 'Stop'}
                </button>
            </div>
            <Canvas camera={{ fov: 30 }} shadows>
                <Game state={gameState} />
            </ Canvas >
        </div>
    );
}

export default App;

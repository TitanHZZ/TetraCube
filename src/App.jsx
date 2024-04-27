import { Canvas } from "@react-three/fiber";
import Game, { GameState } from "./Game";
import { useRef, useState } from "react";

function App() {
    const [gameState, setGameState] = useState(GameState.Quit);
    const [score, setScore] = useState(0);
    const startButtonRef = useRef(null);
    const pauseButtonRef = useRef(null);

    return (
        <div className="h-screen overflow-hidden" style={{ backgroundColor: "#484954" }}>
            <div className="flex justify-center" style={{ transform: 'translate(3.4rem, 0)' }}>
                <div className="text-5xl text-white font-bold text-center my-4 tracking-wider" style={{ textShadow: "4px 4px 5px #558ABB" }}>
                    TetraCube
                </div>
                <button className={`${gameState !== GameState.Quit ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"} w-20 text-white font-bold my-4 ml-5 px-5 rounded`} onClick={() => {
                    if (gameState === GameState.Quit) {
                        setGameState(GameState.Ongoing);
                    } else {
                        setGameState(GameState.Quit);
                        setScore(0);
                    }

                    startButtonRef.current.blur();
                }} ref={startButtonRef}>
                    {gameState !== GameState.Quit ? 'Quit' : 'Start'}
                </button>
                <button className={`bg-orange-500 hover:bg-orange-700 w-24 text-white font-bold my-4 ml-5 px-5 rounded ${(gameState !== GameState.Quit && gameState !== GameState.GameOver) ? 'visible' : 'invisible'}`} onClick={() => {
                    setGameState(gameState === GameState.Ongoing ? GameState.Paused : GameState.Ongoing)
                    pauseButtonRef.current.blur();
                }} ref={pauseButtonRef}>
                    {gameState === GameState.Ongoing ? 'Pause' : 'Resume'}
                </button>
            </div>
            <div className="grid grid-cols-2 h-screen">
                <div className="flex justify-end">
                    <div style={{ width: '40rem' }}>
                        <Canvas camera={{ fov: 30 }} shadows>
                            <Game state={gameState} onPoints={(points) => setScore(score + points)} onGameOver={() => setGameState(GameState.GameOver)} />
                        </ Canvas >
                    </div>
                </div>
                <div className="m-28 text-white font-bold text-2xl">
                    <div className="mb-5">
                        Next:
                    </div>
                    <div>
                        Score: <span className="text-gray-300">{score}</span>
                    </div>
                </div>
            </div>
            <div className={`absolute top-1/2 right-1/2 bg-white px-5 py-4 font-bold text-2xl rounded ${gameState === GameState.GameOver ? 'visible' : 'invisible'}`} style={{ transform: 'translate(50%, -50%)' }}>
                Game over
            </div>
        </div>
    );
}

export default App;

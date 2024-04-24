import { OrbitControls, Plane } from "@react-three/drei";
import Grid from "../components/Grid";
import React, { useEffect, useRef, useState } from "react";
import Piece, { PieceTypes } from "../components/Piece";
import Block from "../components/Block";

const GRID_SIZE = 6;

const GameState = {
    Ongoing: 'Ongoing',
    Done: 'Done'
};

function Game({ state = GameState.Done}) {
    const orbitRef = useRef(null);
    // const gameState = useRef(state);
    const [currentPiece, setCurrentPiece] = useState(null);
    const grid = useRef((() => {
        const initialState = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            const xLayer = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                const yLayer = new Array(GRID_SIZE * GRID_SIZE).fill(null);
                xLayer.push(yLayer);
            }

            initialState.push(xLayer);
        }

        return initialState;
    })());

    // add a new piece when the current one is null
    useEffect(() => {
        if (currentPiece === null && state === GameState.Ongoing) {
            addPiece();
        }
    }, [currentPiece, state]);

    // correct the camera position
    useEffect(() => {
        if (orbitRef.current) {
            const distance = (GRID_SIZE * 3 + 5) / 2 / Math.tan((Math.PI * 30) / 360);

            // change the position
            orbitRef.current.object.position.set(distance / 2, distance / 2, distance / 2);

            // change the camera target (where the camera is looking at)
            orbitRef.current.target.set(0, GRID_SIZE / 2, 0);
        }
    }, [orbitRef.current]);

    const collisionHandler = (displacements) => {
        // TODO: use a callback to change the game state to Done
        const min_disp = Math.min(...displacements.map(d => d.y));
        if (min_disp === 0) {
            // gameState.current = GameState.Done;
            console.log("GAME OVER");
        }

        setCurrentPiece(null);
    };

    const addPiece = () => {
        const possibleTypes = Object.keys(PieceTypes);
        const typeChoice = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];

        const newPiece = <Piece
            type={PieceTypes[typeChoice]}
            position={[GRID_SIZE / 2 - 1, GRID_SIZE * 2 - 1, GRID_SIZE / 2 - 1]}
            grid={grid.current}
            onCollision={collisionHandler}
        />;
        setCurrentPiece(newPiece);
    };

    return (
        <>
            <OrbitControls ref={orbitRef} />

            <ambientLight intensity={1} />
            <directionalLight
                position={[GRID_SIZE / 2 - 0.5, GRID_SIZE * 2 + 1, GRID_SIZE / 2 - 0.5]}
                target-position={[GRID_SIZE / 2 - 0.5, 0, GRID_SIZE / 2 - 0.5]}
                intensity={2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />

            <Grid castShadow receiveShadow size={GRID_SIZE} />

            <Plane name="collision plane" visible={false} args={[GRID_SIZE, GRID_SIZE]} position={[GRID_SIZE / 2 - 0.5, -0.5, GRID_SIZE / 2 - 0.5]} rotation={[-Math.PI / 2, 0, 0]} />
            <Plane name="collision plane" visible={false} args={[GRID_SIZE, GRID_SIZE]} position={[GRID_SIZE / 2 - 0.5, GRID_SIZE / 2 - 0.5, -0.5]} />
            <Plane name="collision plane" visible={false} args={[GRID_SIZE, GRID_SIZE]} position={[GRID_SIZE / 2 - 0.5, GRID_SIZE * 2 - (GRID_SIZE / 2) - 0.5, -0.5]} />
            <Plane name="collision plane" visible={false} args={[GRID_SIZE, GRID_SIZE]} position={[-0.5, GRID_SIZE / 2 - 0.5, GRID_SIZE / 2 - 0.5]} rotation={[0, Math.PI / 2, 0]} />
            <Plane name="collision plane" visible={false} args={[GRID_SIZE, GRID_SIZE]} position={[-0.5, GRID_SIZE * 2 - (GRID_SIZE / 2) - 0.5, GRID_SIZE / 2 - 0.5]} rotation={[0, Math.PI / 2, 0]} />

            {currentPiece}

            {grid.current.map((x_val, x) => {
                return x_val.map((z_val, z) => {
                    return z_val.map((y_val, y) => {
                        if (y_val !== null) {
                            return <Block name="collision block" key={`${x}${y}${z}`} color={y_val} position={[x, y, z]} />;
                        }
                    });
                });
            })}
        </>
    )
}

export default Game;

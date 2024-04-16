import { OrbitControls, Box } from "@react-three/drei";
import Grid from "../components/Grid";
import React, { useEffect, useRef, useState } from "react";
import Piece, { PieceTypes } from "../components/Piece";

const GRID_SIZE = 6;

function App() {
    const orbitRef = useRef(null);
    const [currentPiece, setCurrentPiece] = useState(null);
    const [gridState, setGridState] = useState(() => {
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
    });

    // add a new piece when the current one is null
    useEffect(() => {
        if (currentPiece === null) {
            addPiece();
        }
    }, [currentPiece]);

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

    const addPiece = () => {
        const possibleTypes = Object.keys(PieceTypes);
        const typeChoice = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];

        const collisionHandler = () => setCurrentPiece(null);
        const newPiece = <Piece type={PieceTypes[typeChoice]} position={[2, GRID_SIZE * 2, 2]} grid={gridState} onCollision={collisionHandler} />;
        setCurrentPiece(newPiece);
    };

    return (
        <>
            <OrbitControls ref={orbitRef} />
            <ambientLight intensity={0.8} />
            <Grid size={GRID_SIZE} />

            {currentPiece}

            {gridState.map((x_val, x) => {
                return x_val.map((z_val, z) => {
                    return z_val.map((y_val, y) => {
                        if (y_val !== null) {
                            return (
                                <Box key={`${x}${y}${z}`} args={[1, 1, 1]} position={[x, y, z]}>
                                    <meshPhongMaterial attach="material" color={y_val} />
                                </Box>
                            )
                        }
                    });
                });
            })}
        </>
    )
}

export default App;

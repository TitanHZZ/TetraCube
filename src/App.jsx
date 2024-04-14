import { OrbitControls } from "@react-three/drei";
import Grid from "../components/Grid";
import React, { useEffect, useRef, useState } from "react";
import Piece, { PieceTypes } from "../components/Piece";
import { useFrame } from "@react-three/fiber";

function App() {
    const orbitRef = useRef(null);
    const [pieces, setPieces] = useState([]);

    // correct the camera position
    useEffect(() => {
        if (orbitRef.current) {
            const distance = 35 / 2 / Math.tan((Math.PI * 30) / 360);

            // change the position
            orbitRef.current.object.position.set(distance / 2, distance / 2, distance / 2);

            // change the camera target (where the camera is looking at)
            orbitRef.current.target.set(0, 10, 0);
        }
    }, [orbitRef.current]);

    let collisionHandler = () => {
        console.log("collision");
    };

    useFrame((state, delta, xrFrame) => {
        // add new piece
        if (pieces.length === 0) {
            const newPiece = {
                id: pieces.length + 1,
                content: <Piece type={PieceTypes.Hero} position={[0.5, 20.5, 0.5]} onCollision={collisionHandler} />
            };

            setPieces(prevComponents => [...prevComponents, newPiece]);
        }
    });

    return (
        <>
            <OrbitControls ref={orbitRef} />
            <ambientLight intensity={0.8} />
            <Grid size={10} />

            {pieces.map((piece, idx) => (
                <React.Fragment key={piece.id}>
                    {piece.content}
                </React.Fragment>
            ))}
        </>
    )
}

export default App;

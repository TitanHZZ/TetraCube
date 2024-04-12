import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

// we assume that the block size is 1
const pieces = {
    OrangeRicky: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [2, 0, 0],
            [2, 1, 0]
        ],
        color: "#ffa502"
    },
    Hero: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [2, 0, 0],
            [3, 0, 0]
        ],
        color: "#39e2e3"
    },
    BlueRicky: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [2, 0, 0],
            [0, 1, 0]
        ],
        color: "#0001fe"
    },
    Teewee: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [2, 0, 0],
            [1, 1, 0],
        ],
        color: "#aa01ff"
    },
    ClevelandZ: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [1, -1, 0],
            [2, -1, 0],
        ],
        color: "#ff0100"
    },
    Smashboy: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [0, -1, 0],
            [1, -1, 0],
        ],
        color: "#ffff00"
    },
    Rhodeislandz: {
        pos: [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
            [2, 1, 0],
        ],
        color: "#01ff00"
    }
};

// js object with all the types available in the pieces object above
export const PieceTypes = Object.fromEntries(Object.keys(pieces).map(key => [key, key]));

function Piece({ type = PieceTypes.OrangeRicky, position = [0, 0, 0] }) {
    const pieceRef = useRef();
    const elapsedTime = useRef(0);

    useFrame((state, delta, xrFrame) => {
        // update elapsed time
        elapsedTime.current += delta;

        // reset elapsed time if it exceeds 1 second and move the piece
        if (elapsedTime.current >= 1) {
            elapsedTime.current = 0;
            // pieceRef.current.position.y -= 1;
        }
    });

    return (
        <group ref={pieceRef} position={position}>
            {pieces[type].pos.map((value, index) => (
                <Box key={index} args={[1, 1, 1]} position={value}>
                    <meshPhongMaterial attach="material" color={pieces[type].color} />
                </Box>
            ))}
        </group>
    );
}

export default Piece;

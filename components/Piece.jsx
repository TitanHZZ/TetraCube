import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

// we assume that the block size is 1
const pieces = {
    OrangeRicky: {
        pos: [
            [0, -1, 0],
            [1, -1, 0],
            [2, -1, 0],
            [2, 0, 0]
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
            [0, -1, 0],
            [1, -1, 0],
            [2, -1, 0],
            [0, 0, 0]
        ],
        color: "#0001fe"
    },
    Teewee: {
        pos: [
            [0, -1, 0],
            [1, -1, 0],
            [2, -1, 0],
            [1, 0, 0],
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
            [0, -1, 0],
            [1, -1, 0],
            [1, 0, 0],
            [2, 0, 0],
        ],
        color: "#01ff00"
    }
};

// js object with all the types available in the pieces object
export const PieceTypes = Object.fromEntries(Object.keys(pieces).map(key => [key, key]));

const InvalidPositionReason = {
    CannotGoDown: 'CannotGoDown',
    InvalidPos: 'InvalidPos',
    Ok: 'Ok'
};

const PieceState = {
    BeingUsed: 'Being Used',
    Done: 'Done'
};

function isValidPosition(grid, blocks) {
    for (let i = 0; i < blocks.length; i++) {
        const x = blocks[i].x;
        const y = blocks[i].y;
        const z = blocks[i].z;

        if (x < 0 || z < 0 || x >= grid.length /*|| y >= grid.length * 2*/ || z >= grid.length)
            return [false, InvalidPositionReason.InvalidPos];

        if (y < 0 || grid[x][z][y] !== null)
            return [false, InvalidPositionReason.CannotGoDown];
    }

    return [true, InvalidPositionReason.Ok];
}

function goTo(ref, grid, mov_vector, rot_vector) {
    // position
    ref.current.position.x += mov_vector.x;
    ref.current.position.y += mov_vector.y;
    ref.current.position.z += mov_vector.z;

    // rotation
    ref.current.rotation.x += rot_vector.x;
    ref.current.rotation.y += rot_vector.y;
    ref.current.rotation.z += rot_vector.z;

    const new_pos = ref.current.children.map(c => {
        const position = new Vector3();
        c.getWorldPosition(position)
        return position.round();
    });

    // revert to the old postition if the new one is invalid
    const [got_to_pos, reason] = isValidPosition(grid, new_pos);
    if (got_to_pos === false) {
        // position
        ref.current.position.x -= mov_vector.x;
        ref.current.position.y -= mov_vector.y;
        ref.current.position.z -= mov_vector.z;

        // rotation
        ref.current.rotation.x -= rot_vector.x;
        ref.current.rotation.y -= rot_vector.y;
        ref.current.rotation.z -= rot_vector.z;
    }

    return [got_to_pos, reason];
}

function Piece({ type = PieceTypes.OrangeRicky, position = [0, 0, 0], grid, onCollision }) {
    const pieceRef = useRef(null);
    const elapsedTime = useRef(0);
    const pieceState = useRef(PieceState.BeingUsed);

    const handleKeyDown = (e) => {
        let mov_vector = { x: 0, y: 0, z: 0 };

        // special case of hard drop the piece
        if (e.key.toUpperCase() === ' ') {
            mov_vector.y = -1;

            while (goTo(pieceRef, grid, mov_vector, rot_vector)[0] === true);
            elapsedTime.current = 2;
            return;
        }

        mov_vector.y = 0;
        let rot_vector = { x: 0, y: 0, z: 0 };
        switch (e.key.toUpperCase()) {
            // position
            case 'W':
                mov_vector.z -= 1;
                break;
            case 'S':
                mov_vector.z += 1;
                break;
            case 'A':
                mov_vector.x -= 1;
                break;
            case 'D':
                mov_vector.x += 1;
                break;

            // rotation
            case 'Q':
                rot_vector.x += Math.PI / 2;
                break;
            case 'E':
                rot_vector.y += Math.PI / 2;
                break;
            case 'R':
                rot_vector.z += Math.PI / 2;
                break;
            default:
                break;
        }

        // try to change the piece accordingly to the pressed key
        if (pieceState.current === PieceState.BeingUsed)
            goTo(pieceRef, grid, mov_vector, rot_vector);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useFrame((state, delta, xrFrame) => {
        if (pieceState.current === PieceState.BeingUsed) {
            // update elapsed time
            elapsedTime.current += delta;

            // reset elapsed time if it exceeds 1 second and move the piece
            if (elapsedTime.current >= 1) {
                elapsedTime.current = 0;

                // try to move down
                const mov_vector = { x: 0, y: -1, z: 0 };
                const rot_vector = { x: 0, y: 0, z: 0 };
                const [got_down, reason] = goTo(pieceRef, grid, mov_vector, rot_vector);

                // check if piece can go down
                if (got_down === false && reason === InvalidPositionReason.CannotGoDown) {
                    pieceState.current = PieceState.Done;

                    pieceRef.current.children.map(c => {
                        let position = new Vector3();
                        c.getWorldPosition(position);
                        position = position.round();

                        grid[position.x][position.z][position.y] = pieces[type].color;
                    });

                    onCollision();
                }
            }
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

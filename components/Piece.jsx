import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { DoubleSide, Raycaster, Vector3 } from 'three';
import Block from './Block';
import { Plane } from '@react-three/drei';

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

        if (x < 0 || z < 0 || x >= grid.length || z >= grid.length)
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
        c.getWorldPosition(position);
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

function getCollisions(scene, block, dir) {
    const origin = new Vector3();
    block.getWorldPosition(origin);

    const raycaster = new Raycaster(origin, dir);
    return raycaster.intersectObjects(scene.children);
}

function generate_pos_indicators(pieceRef, scene, setInd) {
    // when the game ends, the ref might not be valid
    if (!pieceRef.current)
        return;

    let new_ind = [];
    const collider_names = ['collision block', 'collision plane']; // names are in order of priority
    const dir_rot = [
        { dir: new Vector3(0, -1, 0), offset: new Vector3(0, 0.001, 0), rot: [-Math.PI / 2, 0, 0] },
        { dir: new Vector3(0, 0, -1), offset: new Vector3(0, 0, 0.001), rot: [0, 0, 0] },
        { dir: new Vector3(-1, 0, 0), offset: new Vector3(0.001, 0, 0), rot: [0, Math.PI / 2, 0] }
    ];

    pieceRef.current.children.map((c, i1) => {
        dir_rot.map(({ dir, offset, rot }, i2) => {
            const collisions = getCollisions(scene, c, dir);

            for (let i = 0; i < collider_names.length; i++) {
                const _collisions = collisions.filter(collision => collision.object.name === collider_names[i]);
                if (_collisions[0]) {
                    _collisions[0].point.add(offset); // avoid multiple surfaces on the exact same level
                    new_ind.push(
                        <Plane key={`${i1}${i2}`} position={_collisions[0].point} rotation={rot}>
                            <meshBasicMaterial side={DoubleSide} color='white' />
                        </Plane>
                    );
                    return;
                }
            }
        });
    });

    setInd(new_ind);
}

function Piece({ type = PieceTypes.OrangeRicky, position = [0, 0, 0], grid, onCollision, paused = false }) {
    const scene = useThree(state => state.scene);
    const pieceRef = useRef(null);
    const elapsedTime = useRef(0);
    const originalPos = useRef([]);
    const pieceState = useRef(PieceState.BeingUsed);
    const [ind, setInd] = useState([]);
    const isPaused = useRef(paused);

    const handleKeyDown = (e) => {
        if (isPaused.current === true)
            return;

        let mov_vector = { x: 0, y: 0, z: 0 };
        let rot_vector = { x: 0, y: 0, z: 0 };

        // special case of hard drop the piece
        if (e.key.toUpperCase() === ' ') {
            mov_vector.y = -1;

            while (goTo(pieceRef, grid, mov_vector, rot_vector)[0] === true);
            elapsedTime.current = 2;
            return;
        }

        mov_vector.y = 0;
        switch (e.key.toUpperCase()) {
            // position
            case 'W':
            case 'ARROWUP':
                mov_vector.z -= 1;
                break;
            case 'S':
            case 'ARROWDOWN':
                mov_vector.z += 1;
                break;
            case 'A':
            case 'ARROWLEFT':
                mov_vector.x -= 1;
                break;
            case 'D':
            case 'ARROWRIGHT':
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

        // try to change the piece according to the pressed key
        if (pieceState.current === PieceState.BeingUsed)
            goTo(pieceRef, grid, mov_vector, rot_vector);

        generate_pos_indicators(pieceRef, scene, setInd);
    };

    useEffect(() => {
        isPaused.current = paused;
    }, [paused]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        // used for the displacement calculation
        originalPos.current = pieceRef.current.children.map(c => {
            const position = new Vector3();
            c.getWorldPosition(position);
            return position.round();
        });

        generate_pos_indicators(pieceRef, scene, setInd);

        // cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useFrame((_, delta, __) => {
        if (pieceState.current === PieceState.Done || paused === true)
            return;

        // update elapsed time
        elapsedTime.current += delta;

        // reset elapsed time if it exceeds 1 second and move the piece
        if (elapsedTime.current >= 1) {
            elapsedTime.current = 0;

            // try to move down
            const mov_vector = { x: 0, y: -1, z: 0 };
            const rot_vector = { x: 0, y: 0, z: 0 };
            const [got_down, reason] = goTo(pieceRef, grid, mov_vector, rot_vector);

            generate_pos_indicators(pieceRef, scene, setInd);

            // check if piece can go down
            if (got_down === false && reason === InvalidPositionReason.CannotGoDown) {
                pieceState.current = PieceState.Done;

                // update the grid with the new blocks
                pieceRef.current.children.map(c => {
                    let position = new Vector3();
                    c.getWorldPosition(position);
                    position = position.round();

                    grid[position.x][position.z][position.y] = pieces[type].color;
                });

                let displacements = [];

                // calculate the final displacement for each block
                pieceRef.current.children.map((c, i) => {
                    const position = new Vector3();
                    c.getWorldPosition(position);

                    const disp = position.round().sub(originalPos.current[i]);
                    const abs_disp = {
                        x: Math.abs(disp.x),
                        y: Math.abs(disp.y),
                        z: Math.abs(disp.z)
                    };

                    displacements.push(abs_disp);
                });

                onCollision(displacements);
            }
        }
    });

    return (
        <>
            <group ref={pieceRef} position={position}>
                {pieces[type].pos.map((value, index) => (
                    <Block key={index} color={pieces[type].color} position={value} />
                ))}
            </group>

            {ind}
        </>
    );
}

export default Piece;

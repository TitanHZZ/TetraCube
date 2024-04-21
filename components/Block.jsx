import { Box } from "@react-three/drei";
import { useRef } from "react";
import { BoxGeometry } from "three";

function Block({ size = 1, color = 'red', linewidth = 1, position = [0, 0, 0] }) {
    const blockRef = useRef(null);

    return (
        <group position={position}>
            <Box castShadow receiveShadow args={[size, size, size]} ref={blockRef}>
                <meshStandardMaterial
                    attach="material"
                    color={color}
                    metalness={1.8}
                    roughness={0.2}
                />
            </Box>
            <lineSegments>
                <edgesGeometry attach="geometry" args={[new BoxGeometry(1, 1, 1), 1]} />
                <lineBasicMaterial attach="material" color="black" linewidth={linewidth} />
            </lineSegments>
        </group>
    );
}

export default Block;

import { Color, LineBasicMaterial } from "three";

function Grid({ size = 6, block_size = 1 }) {
    // grid lines color
    const color = new Color(0x818182);
    const material = new LineBasicMaterial({ color });

    return (
        <group>
            <gridHelper args={[size, size]} position={[(size / 2) - (block_size / 2), -block_size / 2, (size / 2) - (block_size / 2)]} >
                <primitive object={material} attach="material" />
            </gridHelper>

            <gridHelper args={[size, size]} rotation={[Math.PI / 2, 0, 0]} position={[(size / 2) - (block_size / 2), (size / 2) - (block_size / 2), -block_size / 2]}>
                <primitive object={material} attach="material" />
            </gridHelper>
            <gridHelper args={[size, size]} rotation={[Math.PI / 2, 0, 0]} position={[(size / 2) - (block_size / 2), (size + size / 2) - (block_size / 2), -block_size / 2]}>
                <primitive object={material} attach="material" />
            </gridHelper>

            <gridHelper args={[size, size]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[-block_size / 2, (size / 2) - (block_size / 2), (size / 2) - (block_size / 2)]}>
                <primitive object={material} attach="material" />
            </gridHelper>
            <gridHelper args={[size, size]} rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[-block_size / 2, (size + size / 2) - (block_size / 2), (size / 2) - (block_size / 2)]}>
                <primitive object={material} attach="material" />
            </gridHelper>
        </group>
    )
}

export default Grid;

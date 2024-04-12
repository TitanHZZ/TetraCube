import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DoubleSide } from "three";
import Grid from "../components/Grid";
import Piece, { PieceTypes } from "../components/Piece";

function App() {
    return (
        <div className="h-screen" style={{ backgroundColor: "#484954" }}>
            <Canvas camera={{
                position: [0, 0, 7],
                fov: 30
            }}>
                <OrbitControls />
                <ambientLight intensity={0.8} />
                <Grid size={6} />

                <Piece type={PieceTypes.OrangeRicky} position={[0, 12, 0]} />

                <mesh>
                    <planeGeometry args={[20, 20]} />
                    <meshBasicMaterial color="grey" side={DoubleSide} visible={false} />
                </mesh>
            </Canvas>
        </div>
    )
}

export default App;

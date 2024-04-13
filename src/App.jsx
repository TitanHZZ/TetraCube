import { OrbitControls } from "@react-three/drei";
import Grid from "../components/Grid";
import { useEffect, useRef } from "react";

function App() {    
    const orbitRef = useRef(null);
    
    useEffect(() => {
        if (orbitRef.current) {
            const distance = 20 / 2 / Math.tan((Math.PI * 30) / 360);

            // change the position
            orbitRef.current.object.position.set(distance / 2, distance / 2, distance / 2);

            // change the camera target (where the camera is looking at)
            orbitRef.current.target.set(0, 6, 0);
        }
    }, [orbitRef.current]);

    return (
        <>
            <OrbitControls ref={orbitRef} />
            <ambientLight intensity={0.8} />
            <Grid size={6} />
        </>
    )
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Canvas } from '@react-three/fiber';

ReactDOM.createRoot(document.getElementById('root')).render(
    <div className="h-screen" style={{ backgroundColor: "#484954" }}>
        <Canvas camera={{ fov: 30 }}>
            <App />
        </ Canvas >
    </div>
);

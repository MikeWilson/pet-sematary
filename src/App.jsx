import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Forest from './Components/Forest';
import { CameraShake } from '@react-three/drei';
import Fog from './Components/Fog';

let speed = 1;

function Rig({cursorPosition}) {
  const { camera,  } = useThree()
  useFrame(() => {
    camera.position.z -= 0.08 * speed;
    // camera.position.x += cursorPosition.x * 0.2;
    // camera.position.y += cursorPosition.y * 0.2;
    // camera.rotation.z -= cursorPosition.x * 0.1;
    // camera.rotation.x = cursorPosition.y * 0.1;
  });

  return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.01} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4} />;
}

// event for mouse click
window.addEventListener('mousedown', () => {
  speed = 2;
});
window.addEventListener('mouseup', () => {
  speed = 1;
});

function App() {

  // State for storing normalized cursor positions
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveHandler = (event) => {
      // Calculate normalized position (-1 to 1) for x and y
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setCursorPosition({ x, y });
    };

    // Add event listener for mouse move
    window.addEventListener('mousemove', moveHandler);

    // Remove event listener on cleanup
    return () => window.removeEventListener('mousemove', moveHandler);
  }, []);

  return (
    <Canvas color='black' style={{width: '100vw', height: '100vh'}} >
      <Rig cursorPosition={cursorPosition} />
      <Forest treeCount={400} spread={10} />
      <ambientLight intensity={.7} />
      <Fog color={0xffffff} density={0.09} />
      <directionalLight 
        position={[10, 10, 10]} // Position of the sun, adjust as needed
        color="red" 
        intensity={2} 
        castShadow // If you want the sun to cast shadows
      />
    </Canvas>
  );
}

export default App;
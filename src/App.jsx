import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Forest from './Components/Forest';
import { CameraShake } from '@react-three/drei';
import Fog from './Components/Fog';
import Moon from './Components/Moon';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'


function PointerEventsWrapper({ children }) {
  const ref = React.useRef();

  React.useEffect(() => {
    const handleMouseEnter = () => {
      ref.current.style.clipPath = 'inset(10% 0% 10% 0%)'; // Full height and width
    };

    const handleMouseLeave = () => {
      ref.current.style.clipPath = 'inset(40% 0% 40% 0%)'; // 10% height, full width
    };

    const node = ref.current;
    node.addEventListener('pointerover', handleMouseEnter);
    node.addEventListener('pointerout', handleMouseLeave);

    return () => {
      node.removeEventListener('pointerover', handleMouseEnter);
      node.removeEventListener('pointerout', handleMouseLeave);
    };
  }, []);

  return <div ref={ref} style={{clipPath: 'inset(40% 0% 40% 0%)', transition: 'clip-path .3s ease-in-out'}}>{children}</div>;
}

let speed = .75;
let minHeight = 1;
let maxHeight = 50;

function Rig({cursorPosition}) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.z -= 0.08 * speed;
    camera.position.x += cursorPosition.x * 0.2;
    let newY = camera.position.y + cursorPosition.y * 0.1;
    if (newY < minHeight) {
      camera.position.y = minHeight;
    } else if (newY > maxHeight) {
      camera.position.y = maxHeight;
    } else {
      camera.position.y = newY;
    }
    camera.rotation.z -= cursorPosition.x * 0.2;
    let heightFactor = 1 - (camera.position.y - minHeight) / (maxHeight - minHeight);
    camera.rotation.x = cursorPosition.y * 0.6 * heightFactor;
  });

  return <CameraShake maxYaw={0.01} maxPitch={0.01} maxRoll={0.02} yawFrequency={0.5} pitchFrequency={0.5} rollFrequency={0.4} />;
}

// event for mouse click
window.addEventListener('mousedown', () => {
  speed = 0;
});
window.addEventListener('mouseup', () => {
  speed = 1;
});

function App() {

  // State for storing normalized cursor positions
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef();

  useEffect(() => {
    const moveHandler = (event) => {
      // Calculate normalized position (-1 to 1) for x and y
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setCursorPosition({ x, y });
    };

    const exitHandler = () => {
      // Reset cursor position on mouse exit
      setCursorPosition({ x: 0, y: 0 });
    };

    // Add event listener for mouse move and mouse exit
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', moveHandler);
    canvas.addEventListener('mouseout', exitHandler);

    // Remove event listeners on cleanup
    return () => {
      canvas.removeEventListener('mousemove', moveHandler);
      canvas.removeEventListener('mouseout', exitHandler);
    };
  }, []);

  const divStyle = {
    width: '100vw',
    height: '100vh',
    background: 'black', // or white depending on the effect you want
    mixBlendMode: 'screen',
    filter: 'contrast(500%)',
  };

  return (
    <PointerEventsWrapper>
      <div style={divStyle}>
        <Canvas color='black' style={{width: '100vw', height: '100vh', filter: 'blur(2px)'}} ref={canvasRef}>
          <Rig cursorPosition={cursorPosition} />
          <Forest treeCount={500} spread={15} treeColor={"white"} distance={40}/>
          <ambientLight intensity={0.5} />
          <Fog color={0x000000} density={0.02} />
          <directionalLight 
            position={[5, 7, -15]} // Position of the sun, adjust as needed
            color="red" 
            intensity={4} 
            castShadow // If you want the sun to cast shadows
          />
          <Moon color="white" />
        </Canvas>
      </div>
    </PointerEventsWrapper>
  );
}



export default App;
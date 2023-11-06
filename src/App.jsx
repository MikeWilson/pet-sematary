import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import Trees from './Components/Forest';

extend({ PerspectiveCamera });

function Camera(props) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.updateMatrixWorld();
  });
  return <perspectiveCamera ref={ref} {...props} />;
}

function App() {
  return (
    <Canvas style={{width: '100vw', height: '100vh'}}>
      <Camera position={[0, 0, 5]} />
      <Forest numberOfTrees={50} />
    </Canvas>
  );
}

export default App;
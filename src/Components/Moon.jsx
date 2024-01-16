import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { MeshBasicMaterial } from 'three';
import { Plane } from '@react-three/drei';

function Moon({position = [-80,150,-300], ...props}) {
  const moonRef = useRef();
  const moonTexture = useTexture('./moon/mats/moon_albedo.png');

  return (
    <Plane ref={moonRef} position={position} args={[20, 20, 32, 32]}> 
        <meshBasicMaterial map={moonTexture} transparent style={{}}/>
    </Plane>
  );
}

export default Moon;
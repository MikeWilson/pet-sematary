import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SphereGeometry, MeshBasicMaterial, Vector3 } from 'three';

function Moon({color}) {
  const { camera } = useThree();
  const moonRef = useRef();

  useFrame(() => {
    if (moonRef.current) {
      // Set the moon's position relative to the camera
      moonRef.current.position.set(
        camera.position.x, // 5 units to the right of the camera
        camera.position.y + 2, // 5 units above the camera
        camera.position.z - 15 // 10 units in front of the camera
      );
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[1.7, 32, 32]} /> {/* 1 unit radius, 32 width segments, 32 height segments */}
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default Moon;
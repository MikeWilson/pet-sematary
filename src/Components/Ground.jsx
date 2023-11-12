import React, { useRef, useState } from 'react';
import { useFrame, useLoader, extend  } from '@react-three/fiber';
import { Plane, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom Shader Material
const WaveShaderMaterial = shaderMaterial(
  { uTexture: null }, // Load the texture using useLoader
  // vertex shader
  `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(0.1 * (pos.x + pos.z)) * 1.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // fragment shader
  `
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      gl_FragColor = vec4(color.rgb, 1.0);
    }
  `
);

extend({ WaveShaderMaterial });

const Ground = ({ position = [0, -0.5, 0], texturePath, ...props }) => {
  const planeRef1 = useRef();
  const planeRef2 = useRef();

  const texture = useLoader(THREE.TextureLoader, texturePath);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(75, 75);

  // Define a constant for the distance at which the planes will leapfrog
  const leapfrogDistance = 100;

  useFrame(({ clock, camera }) => {
    // Adjust the position of the planes based on the camera's position
    if (camera.position.z < planeRef1.current.position.z - leapfrogDistance / 2) {
      planeRef1.current.position.z -= leapfrogDistance * 2;
    }
    if (camera.position.z < planeRef2.current.position.z - leapfrogDistance / 2) {
      planeRef2.current.position.z -= leapfrogDistance * 2;
    }
  });

  // Render the component only when the texture is loaded
  return (
    <>
      <Plane ref={planeRef1} args={[100, 100, 100, 100]} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <waveShaderMaterial attach="material" uniforms-uTexture-value={texture} {...props} />
      </Plane>
      <Plane ref={planeRef2} args={[100, 100, 100, 100]} position={[position[0], position[1], position[2] + leapfrogDistance]} rotation={[-Math.PI / 2, 0, 0]}>
        <waveShaderMaterial attach="material" uniforms-uTexture-value={texture} {...props} />
      </Plane>
    </>
  );
};

export default Ground;
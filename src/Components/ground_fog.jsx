import * as THREE from 'three';
import React, { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial, Plane } from '@react-three/drei';

const FogShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uColor: new THREE.Color(1,1,1),
    uFogNear: 0,
    uFogFar: 10,
    uFogHeight: 1,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying float fogDepth;
    void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        fogDepth = worldPosition.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }  
  `,
  // Fragment Shader
  `
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform float uFogHeight;
    varying vec2 vUv;
    varying float fogDepth;
    
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
        float fogNoise = noise(vUv * 10.0 + uTime);
        float fogFactor = smoothstep(uFogNear, uFogFar, fogDepth + fogNoise * 0.2);
    
        // More dynamic noise for a wisping effect
        float dynamicNoise = noise(vUv * 5.0 + uTime * 0.5);
        fogFactor *= dynamicNoise;
    
        // Make the fog thicker
        fogFactor = pow(fogFactor, 3.0);
    
        gl_FragColor = vec4(uColor, (1.0 - fogFactor) * step(fogDepth, uFogHeight));
    }
  
  `
);

extend({ FogShaderMaterial });

function GroundFog() {
  const shaderRef = useRef();

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0,-1,0]}>
      <fogShaderMaterial ref={shaderRef} attach="material" transparent />
    </Plane>
  );
}

export default GroundFog;
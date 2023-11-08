import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshBasicMaterial, Vector3, SphereGeometry } from "three";
import { GUI } from 'dat.gui';

const Tree = React.memo(({ position, scale, gltf }) => {
  const blackMaterial = useMemo(() => new MeshBasicMaterial({ color: "black" }), []);
  const model = useRef(gltf.scene.clone()).current;

  return (
    <group position={position} dispose={null} scale={scale}>
      <primitive object={model} material={blackMaterial} />
    </group>
  );
});

// Create a GUI
const gui = new GUI();
const config = {
  hillAmplitude: 1.3,
  hillFrequency: 0.1,
};

// Add controls for hill amplitude and frequency
gui.add(config, 'hillAmplitude', 0, 5);
gui.add(config, 'hillFrequency', 0, 1);

// const Tree = React.memo(({ position, scale }) => {
//   const sphereMaterial = useMemo(() => new MeshBasicMaterial({ color: "black" }), []);
//   const geometry = new SphereGeometry(0.5, 32, 32);

//   return (
//     <mesh position={position} material={sphereMaterial}>
//       <primitive object={geometry} attach="geometry" scale={scale} />
//     </mesh>
//   );
// });

const calculateHillHeight = (x, z) => {
  const frequency = 0.1; // The frequency of the hills
  const amplitude = 1.3; // The amplitude (height) of the hills
  return Math.sin(frequency * (x + z)) * amplitude;
};

const Forest = ({ treeCount, spread }) => {
  const gltf = useGLTF("./redwood.glb", true);
  const modelOriginalHeight = 0.59; // Actual model height
 
   const calculateHillHeight = (x, z) => {
     return Math.sin(config.hillFrequency * (x + z)) * config.hillAmplitude;
   };

  // Generate initial positions and scales for the trees
  const initialTrees = useMemo(() => {
    return new Array(treeCount).fill().map(() => {
      const x = (Math.random() - 0.5) * spread * 2;
      const z = (Math.random() - 0.5) * spread * 10;
      const scaleY = Math.random() * 2 + 1; // Random scale for the y-axis
      const hillHeight = calculateHillHeight(x, z); // Get the hill height for this tree's position
  
      return {
        position: new Vector3(
          x,
          hillHeight + (modelOriginalHeight * scaleY - modelOriginalHeight) / 2, // Adjust y-position based on scale
          z
        ),
        scale: [1.4, scaleY, 1.4], // Apply the scale factor to the y-axis
      };
    });
  }, [treeCount, spread]);

  const [trees, setTrees] = useState(initialTrees);

  const { camera } = useThree();

  useFrame(() => {
    setTrees((currentTrees) =>
      currentTrees.map((tree) => {
        if (tree.position.z > camera.position.z) {
          const x = camera.position.x + (Math.random() - 0.5) * spread * 3;
          const z = camera.position.z - (Math.random() * 20 + 25);
          const scaleY = Math.random() * 2 + 1; // Random scale for the y-axis
          const hillHeight = calculateHillHeight(x, z); // Get the new hill height for the respawned tree
  
          return {
            ...tree,
            position: new Vector3(
              x,
              hillHeight + (modelOriginalHeight * scaleY - modelOriginalHeight) / 2, // Adjust y-position based on scale
              z
            ),
            scale:  [1.4, scaleY, 1.4], // Apply the scale factor to the y-axis
          };
        }
        return tree; // Tree is still ahead of the camera
      })
    );
  });
  

  return (
    <>
      {trees.map((tree, index) => (
        <Tree
          key={index}
          position={tree.position}
          scale={tree.scale}
          gltf={gltf}
        />
      ))}
    </>
  );
};

export default Forest;


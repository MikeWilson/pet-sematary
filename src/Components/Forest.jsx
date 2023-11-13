import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshBasicMaterial, Vector3, SphereGeometry } from "three";
import { GUI } from 'dat.gui';
import Ground from './Ground';

const Tree = React.memo(({ position, scale, gltf, rotation, treeColor }) => {
  const blackMaterial = useMemo(() => new MeshBasicMaterial({ color: treeColor }), []);
  const model = useRef(gltf.scene.clone()).current;

  // Apply black material to all child meshes
  model.traverse((child) => {
    if (child.isMesh) {
      child.material = blackMaterial;
    }
  });

  return (
    <group position={position} dispose={null} scale={scale} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
});

// Create a GUI
const gui = new GUI();
const config = {
  hillAmplitude: 1.4,
  hillFrequency: 0.1,
};

// Add controls for hill amplitude and frequency
gui.add(config, 'hillAmplitude', 0, 5);
gui.add(config, 'hillFrequency', 0, 1);

const calculateHillHeight = (x, z) => {
  return Math.sin(config.hillFrequency * (x + z)) * config.hillAmplitude;
};

const Forest = ({ treeCount, spread, treeColor, distance }) => {
  const gltf = useGLTF("./redwood.glb", true);
  const modelOriginalHeight = 0.59; // Actual model height
 
  // Generate initial positions and scales for the trees
  const initialTrees = useMemo(() => {
    return new Array(treeCount).fill().map(() => {
      const x = (Math.random() - 0.5) * spread * 2;
      const z = (Math.random() - 0.5) * spread * distance;
      const rotation = Math.random() * Math.PI * 2; // Random rotation around the y-axis
      const scaleY = Math.random() * 3 + 2; // Random scale for the y-axis
      const hillHeight = calculateHillHeight(x, z); // Get the hill height for this tree's position
  
      return {
        position: new Vector3(
          x,
          hillHeight + (modelOriginalHeight * scaleY - modelOriginalHeight) / 2, // Adjust y-position based on scale
          z
        ),
        scale: [2, scaleY, 2], // Apply the scale factor to the y-axis
        rotation: [0, rotation, 0],
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
          const z = camera.position.z - (Math.random() * spread + distance);
          const rotation = Math.random() * Math.PI * 2; // Random rotation around the y-axis
          const scaleY = Math.random() * 3 + 2; // Random scale for the y-axis
          const hillHeight = calculateHillHeight(x, z); // Get the new hill height for the respawned tree
  
          return {
            ...tree,
            position: new Vector3(
              x,
              hillHeight + (modelOriginalHeight * scaleY - modelOriginalHeight) / 2, // Adjust y-position based on scale
              z
            ),
            scale:  [2, scaleY, 2], // Apply the scale factor to the y-axis
            rotation: [0, rotation, 0],
          };
        }
        return tree; // Tree is still ahead of the camera
      })
    );
  });
  

  return (
    <>
    {/* <Ground spread={spread} texturePath={'./leaves_texture.png'} /> */}
      {trees.map((tree, index) => (
        <Tree
          key={index}
          position={tree.position}
          scale={tree.scale}
          rotation={tree.rotation}
          gltf={gltf}
          treeColor={treeColor}
        />
      ))}
    </>
  );
};

export default Forest;


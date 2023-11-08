import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { MeshBasicMaterial, Vector3 } from "three";

const Tree = React.memo(({ position, scale, gltf }) => {
  const blackMaterial = useMemo(() => new MeshBasicMaterial({ color: "black" }), []);
  const model = useRef(gltf.scene.clone()).current;

  return (
    <group position={position} dispose={null} scale={scale}>
      <primitive object={model} material={blackMaterial} />
    </group>
  );
});

const calculateHillHeight = (x, z) => {
  const frequency = 3; // The frequency of the hills
  const amplitude = 1; // The amplitude (height) of the hills
  return Math.sin(frequency * (x + z)) * amplitude;
};

const Forest = ({ treeCount, spread }) => {
  const gltf = useGLTF("./redwood.glb", true);
  const modelOriginalHeight = 0.5935667157173157; // Actual model height

  // Generate initial positions and scales for the trees
  const initialTrees = useMemo(() => {
    return new Array(treeCount).fill().map(() => {
      const x = (Math.random() - 0.5) * spread * 3;
      const z = (Math.random() - 0.5) * spread * 10;
      const desiredHeight = Math.random() * 2 + 0.5; // Random height between 0.5 and 2.5
      const scaleY = desiredHeight / modelOriginalHeight; // Calculate the scale factor for y-axis
      const hillHeight = calculateHillHeight(x, z); // Get the hill height for this tree's position
  
      return {
        position: new Vector3(
          x,
          (desiredHeight / 2) + hillHeight, // Position the base at the hill height
          z
        ),
        scale: [1, scaleY, 1], // Apply the scale factor only to the y-axis
      };
    });
  }, [treeCount, spread]);

  const [trees, setTrees] = useState(initialTrees);

  const { camera } = useThree();

  useFrame(() => {
    setTrees((currentTrees) =>
      currentTrees.map((tree) => {
        if (tree.position.z > camera.position.z) {
          const x = (Math.random() - 0.5) * spread * 3;
          const z = camera.position.z - (Math.random() * 30 + 30);
          const desiredHeight = Math.random() * 2 + 0.5;
          const scaleY = desiredHeight / modelOriginalHeight;
          const hillHeight = calculateHillHeight(x, z); // Get the new hill height for the respawned tree
  
          return {
            ...tree,
            position: new Vector3(
              camera.position.x + x,
              (desiredHeight / 2) + hillHeight, // Adjust the y position based on the hill height
              z
            ),
            scale: [1, scaleY, 1],
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

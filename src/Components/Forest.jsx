import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree} from '@react-three/fiber';
import { Vector3 } from 'three';

// Tree component with simple box geometry
const Tree = ({ position }) => (
  <>
  <mesh position={position}>
    <boxGeometry args={[1, 15, 1]} />
    <meshStandardMaterial color="brown" />
  </mesh>
  <mesh position={[position.x, position.y + 5, position.z]}>
    <sphereGeometry args={[5]} position={[0,20,0]} />
    <meshStandardMaterial color="green" />
  </mesh>
  </>
);

// Forest component that manages the pool of trees
const Forest = ({ treeCount, spread }) => {
  // Generate initial positions for the trees
  const initialPositions = new Array(treeCount).fill().map(() => ({
    x: (Math.random() - 0.5) * spread,
    y: 0,
    z: (Math.random() - 0.5) * spread * 10,
  }));

  const [trees, setTrees] = useState(initialPositions);

  const { camera, mouse } = useThree()
  // Update tree positions based on the camera's z position
  useFrame(() => {
    const cameraZ = camera.position.z;
    setTrees((currentTrees) =>
      currentTrees.map((tree) => {
        if (tree.z > cameraZ) {
          // Tree is behind the camera, respawn ahead
          return {
            ...tree,
            x: camera.position.x + (Math.random() - 0.5) * spread, // Adjust x spawn limits based on camera's x position
            z: cameraZ - spread - (Math.random() * 10 + 50), // Random number between -50 and -60
          };
        }
        return tree; // Tree is still ahead of the camera
      }),
    );
  });

  return (
    <>
      {trees.map((tree, index) => (
        <Tree key={index} position={new Vector3(tree.x, tree.y, tree.z)} />
      ))}
    </>
  );
};

export default Forest;
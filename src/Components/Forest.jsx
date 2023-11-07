import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader} from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGLTF } from '@react-three/drei';
import { MeshBasicMaterial } from 'three';


// Tree component with simple box geometry
// const Tree = ({ position }) => (
//   <>
//   <mesh position={position}>
//     <boxGeometry args={[1, 15, 1]} />
//     <meshStandardMaterial color="brown" />
//   </mesh>
//   <mesh position={[position.x, position.y + 5, position.z]}>
//     <sphereGeometry args={[5]} position={[0,20,0]} />
//     <meshStandardMaterial color="green" />
//   </mesh>
//   </>
// );

const Tree = ({ position, gltf }) => {
  const blackMaterial = new MeshBasicMaterial({ color: 'black' });
  const model = gltf.scene.clone();
  
  return (
    <group position={position} dispose={null} scale={[5, 7, 5]}>
      <primitive object={model} material={blackMaterial}/>
    </group>
  );
};

// Forest component that manages the pool of trees
const Forest = ({ treeCount, spread }) => {
  const gltf = useGLTF('./redwood.glb', true);

  // Generate initial positions for the trees
  const initialPositions = new Array(treeCount).fill().map(() => ({
    x: (Math.random() - 0.5) * spread  * 3,
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
            x: camera.position.x + (Math.random() - 0.5) * spread * 3, // Adjust x spawn limits based on camera's x position
            z: cameraZ - (Math.random() * 30 + 30), // Random number between 30 and 60 away from the camera's z position
          };
        }
        return tree; // Tree is still ahead of the camera
      }),
    );
  });

  return (
    <>
    {trees.map((tree, index) => (
      <Tree key={index} position={new Vector3(tree.x, tree.y, tree.z)}  gltf={gltf} />
    ))}
  </>
  );
};

export default Forest;
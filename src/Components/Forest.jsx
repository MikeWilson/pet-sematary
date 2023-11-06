import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Vector3 } from 'three';
import Tree from './Tree';


// Main scene component
const Forest = ({ treeModelPath, numberOfTrees }) => {

  // Create an array of positions for the trees
  const [trees, setTrees] = useState(() => {
    return new Array(numberOfTrees).fill().map((_, i) => ({
      position: new Vector3((Math.random() - 0.5) * 500, 0, (Math.random() - 0.5) * 500)
    }));
  });

  return (
    <>
      {trees.map((tree, index) => (
        <Tree key={index} />
      ))}
    </>
  );
};

export default Forest;
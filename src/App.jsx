import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Sky, Stars} from '@react-three/drei';
import Floor from './components/floor';
import Lantern from './components/lantern';
// import Fog from './Components/fog';
import Moon from './components/moon';
import BirchTrees from './components/birch_trees';

const moonPosition = [-80,150,-300];

function App() {
  return (
    <Canvas style={{ width: '100vw', height: '100vh', backgroundColor: "black" }}>
      <OrbitControls />
      <Floor planeArgs={[100, 100, 10, 10]} position={[0,-1.3,-30]} />
      <Floor planeArgs={[20, 20, 200, 200]} position={[0,-1,-3]} />
      
      <BirchTrees count={1} spread={2} />
      
      <Lantern intensity={15} color={"#ffd8a1"} />
      <directionalLight intensity={1} color={'#ebfffd'} position={moonPosition}/>

      {/* <Fog color={"black"} density={0.00025}/> */}


      <Moon color={"#ffd8a1"} position={moonPosition}/>
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={1} fade speed={1} />

      <ambientLight intensity={1} />
    </Canvas>
  );
}

export default App;

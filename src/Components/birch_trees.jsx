import { useEffect, useRef, memo} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";


const AnimatedModel = memo(({ url, ...props }) => {
  const ref = useRef();

  const { scene, animations } = useGLTF("./birch.glb", true);
  const { actions, mixer } = useAnimations(animations, ref);
  console.log(actions);

  useEffect(() => {
    actions.windAction.play();
  }, [mixer]);

  // useFrame((state, delta) => {
  //   actions["Action"].mixer.update(delta);
  // });

  return <primitive {...props} ref={ref} object={scene} dispose={null} />;
});

function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

export default function BirchTrees({ count = 10, spread = 10 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <AnimatedModel
          key={i}
          position={[
            getRandomPosition(-spread, spread), // Corrected to use both min and max
            -1.2,
            getRandomPosition(-spread / 2, spread / 2), // Corrected to use both min and max
          ]}
        />
      ))}
    </>
  );
}

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { FogExp2 } from 'three'

export default function Fog({ color = "black", density = 0.00025 }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new FogExp2(color, density);
    return () => {
      scene.fog = null; // Remove fog when the component unmounts
    };
  }, [scene, color, density]);

  return null;
}
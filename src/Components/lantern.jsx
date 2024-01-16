import { useRef } from 'react';
import { useFrame } from '@react-three/fiber'

const defaultProps = {
  intensity: 3,
  color: 'white'
}

function Lantern(props) {
  const { intensity, color } = { ...defaultProps, ...props };
  const ref = useRef()
  useFrame(({ mouse }) => {
    ref.current.position.set(mouse.x * 4, 0, -mouse.y * 5)
    ref.current.intensity = intensity + Math.random() * 0.5 - 0.25 * mouse.y;
  })
  return <pointLight ref={ref} intensity={intensity} color={color} />
}

export default Lantern
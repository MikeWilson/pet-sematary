import React from 'react';
import { Plane, useTexture } from '@react-three/drei';

function Floor({planeArgs = [10,10, 100, 100], position = [0,-4,0], ...props}) {
  const normalMap = useTexture('/floor/mats/floor_normal.png');
  const albedo = useTexture('/floor/mats/floor_albedo.png');

  const materialProps = {
    attach: "material",
    map: albedo,
    normalMap: normalMap,
    color: '#fff',
    normalScale: 1,
    ...props
  };

  return (
    <Plane args={planeArgs} rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <meshStandardMaterial {...materialProps} />
    </Plane>
  );
}

export default Floor;
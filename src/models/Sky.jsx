import React from 'react'
import skyScene from '../assets/3d/sky.glb'
import { useGLTF } from '@react-three/drei'

const Sky = () => {
    const sky = useGLTF(skyScene);
    
    return (
        <mesh 
            position={[0, 0, -50]}  // Move sky further back
            scale={[10, 10, 10]}    // Make sky much larger
            rotation={[0, 0, 0]}    // Adjust rotation if needed
        >
            <primitive object={sky.scene}/>
        </mesh>
    )
}

export default Sky
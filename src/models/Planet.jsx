import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import {useFrame, useThree } from '@react-three/fiber'
import { a } from '@react-spring/three'

import planetScene from '../assets/3d/planet.glb';

const Planet = ({ isRotating, setIsRotating, ...props}) => {
  const planetRef = useRef();
  const {gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(planetScene)

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  }

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  }

  const handlePointerMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      
      const delta = (clientX - lastX.current) / viewport.width;

      if (planetRef.current) {
        planetRef.current.rotation.y += delta * Math.PI;
      }

      lastX.current = clientX;
      rotationSpeed.current = delta * Math.PI;
    }
  }

  const handleKeyDown = (e) => {
    if (!planetRef.current) return;

    const rotationIncrement = 0.1; // Smaller increment for more precise control
    
    switch(e.key) {
      case 'ArrowLeft':
        setIsRotating(true);
        planetRef.current.rotation.y += rotationIncrement;
        rotationSpeed.current = rotationIncrement;
        break;
      case 'ArrowRight':
        setIsRotating(true);
        planetRef.current.rotation.y -= rotationIncrement;
        rotationSpeed.current = -rotationIncrement;
        break;
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setIsRotating(false);
    }
  }

  useFrame(() => {
    // Smooth rotation deceleration when not actively rotating
    if (!isRotating) {
      rotationSpeed.current *= dampingFactor;
      
      if (planetRef.current) {
        planetRef.current.rotation.y += rotationSpeed.current;
      }

      // Stop rotation when speed becomes very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }
    }
  })

  useEffect(() => {
    const canvas = gl.domElement;
    
    // Mouse/Touch Events
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    // Keyboard Events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      // Remove Mouse/Touch Event Listeners
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);

      // Remove Keyboard Event Listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [gl])

  return (
    <a.group ref={planetRef} {...props}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[-0.003, 0.024, -6.331]} rotation={[0.238, -0.545, 0.562]} scale={7}>
          <mesh
            geometry={nodes.planet001_1.geometry}
            material={materials.scene}
          />
          <mesh
            geometry={nodes.planet001_2.geometry}
            material={materials.scene}
          />
        </group>
      </group>
    </a.group>
  )
}

export default Planet;
import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '../components/Loader'
import Planet from '../models/Planet';
import Sky from '../models/Sky';


const Home = () => {
    const [isRotating, setIsRotating] = useState(false);
    const adjustPlanetForScreenSize = () => {
        let screenScale, screenPosition, rotation;
        
        if (window.innerWidth < 768) {
            // Mobile view
            screenScale = [1.4, 1.4, 1.4];
            screenPosition = [0, 5, -35]; // Moved up
            rotation = [0.1, 4.7, 0];
        } else {
            // Desktop view
            screenScale = [2, 2, 2];
            screenPosition = [0, 5, -40]; // Moved up
            rotation = [0.1, 4.7, 0];
        }
        
        return [screenPosition, screenScale, rotation];
    }
    
    const [planetPosition, planetScale, planetRotation] = adjustPlanetForScreenSize();
    
    return (
        <section className="w-full h-screen relative">
            <Canvas 
                className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
                camera={{
                    near: 0.1, 
                    far: 1000,
                    position: [0, 0, 1]
                }}
            >
                <Suspense fallback={<Loader />}>
                    <directionalLight position={[1, 1, 1]} intensity={2} />
                    <ambientLight intensity={0.5}/>
                    <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1}/>
                    
                    <Sky/>
                    <Planet 
                        position={planetPosition}
                        scale={planetScale}
                        rotation={planetRotation}
                        isRotating={isRotating}
                        setIsRotating={setIsRotating}
                        rotation={[0, 20, 0]}/>
                    
                </Suspense>
            </Canvas>
        </section>
    )
}
export default Home
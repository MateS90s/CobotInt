import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import URDFLoader from 'urdf-loader';

const URDFModel = ({ urdfContent }) => {
  const { scene } = useThree();
  const robotRef = useRef();

  useEffect(() => {
    const loader = new URDFLoader();
    loader.loadMaterialsTextures = false; // Nie ładujemy tekstur

    try {
      const robot = loader.parse(urdfContent);
      console.log('Parsed robot:', robot);
      console.log('Robot children:', robot.children);

      if (robot.children.length === 0) {
        console.warn('Robot has no children. This might cause rendering issues.');
      }

      robotRef.current = robot;
      scene.add(robot);

      // Tworzenie pudełka, w którym jest robot (bounding box)
      const box = new THREE.Box3().setFromObject(robot);
      const center = box.getCenter(new THREE.Vector3());  //wymiary tego pudełka na podstawie całej geometrii obiektu robota
      robot.position.sub(center);

      //Ustawianie robota
      robot.rotation.x = -Math.PI / 4;  // Obrót o 45 stopni wokół osi X
      robot.rotation.y = 0;  // Obrót o 45 stopni wokół osi Y
      robot.rotation.z = -Math.PI / 4;            // Brak rotacji wokół osi Z

      // Dostosowanie kamery
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = 75;
      const cameraZ = maxDim / 2 / Math.tan((fov / 2) * Math.PI / 180);
      scene.parent.camera.position.set(cameraZ, cameraZ, cameraZ);
      scene.parent.camera.lookAt(new THREE.Vector3(0, 0, 0));
    } catch (error) {
      console.error('Error parsing URDF:', error);
    }

    return () => {
      if (robotRef.current) {
        scene.remove(robotRef.current);
      }
    };
  }, [urdfContent, scene]);

  return null;
};

const RobotVisualization = ({ urdfContent }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {urdfContent && <URDFModel urdfContent={urdfContent} />}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default RobotVisualization;
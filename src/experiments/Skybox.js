import React, { useRef } from "react";
import { Canvas, extend, useThree, useFrame } from "react-three-fiber";
import { CubeTextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./Skybox.css";

extend({ OrbitControls });

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame with useFrame
  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate={true}
      enableZoom={false}
    />
  );
};

// Loads the skybox texture and applies it to the scene.
function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "images/Skybox/1.jpg",
    "images/Skybox/2.jpg",
    "images/Skybox/3.jpg",
    "images/Skybox/4.jpg",
    "images/Skybox/5.jpg",
    "images/Skybox/6.jpg",
  ]);
  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}

// Geometry
function Sphere() {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <sphereGeometry attach="geometry" args={[2, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        color="white"
        roughness={0.1}
        metalness={1}
      />
    </mesh>
  );
}

// Lights
function SkyboxApp() {
  return (
    <Canvas className="canvas">
      <CameraControls />
      <Sphere />
      <SkyBox />
    </Canvas>
  );
}

export default SkyboxApp;

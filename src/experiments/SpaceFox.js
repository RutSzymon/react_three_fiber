import React, { Suspense, useRef, useState } from "react";
import {
  Canvas,
  useLoader,
  useFrame,
  extend,
  useThree,
} from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader } from "three";
import {
  shipPositionState,
  laserPositionState,
  enemyPositionState,
} from "../components/gameState";

import "./styles.css";

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

const GROUND_HEIGHT = -50; // A Constant to store the ground height of the game.

function Loading() {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

// A Ground plane that moves relative to the player. The player stays at 0,0
function Terrain() {
  const terrain = useRef();

  useFrame(() => {
    terrain.current.position.z += 0.4;
  });
  return (
    <mesh
      visible
      position={[0, GROUND_HEIGHT, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={terrain}
    >
      <planeBufferGeometry attach="geometry" args={[5000, 5000, 128, 128]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        roughness={1}
        metalness={0}
        wireframe
      />
    </mesh>
  );
}

function ArWing() {
  const [shipPosition, setShipPosition] = useRecoilState(shipPositionState);

  const ship = useRef();
  useFrame(({ mouse }) => {
    setShipPosition({
      position: { x: mouse.x * 6, y: mouse.y * 2 },
      rotation: { z: -mouse.x * 0.5, x: -mouse.x * 0.5, y: -mouse.y * 0.2 },
    });
  });
  // Update the ships position from the updated state.
  useFrame(() => {
    ship.current.rotation.z = shipPosition.rotation.z;
    ship.current.rotation.y = shipPosition.rotation.x;
    ship.current.rotation.x = shipPosition.rotation.y;
    ship.current.position.y = shipPosition.position.y;
    ship.current.position.x = shipPosition.position.x;
  });

  const { nodes } = useLoader(GLTFLoader, "3d_models/SpaceFox/arwing.glb");

  return (
    <group ref={ship}>
      <mesh visible geometry={nodes.Default.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

// Draws two sprites in front of the ship, indicating the direction of fire.
// Uses a TextureLoader to load transparent PNG, and sprite to render on a 2d plane facing the camera.
function Target() {
  // Create refs for the two sprites we will create.
  const rearTarget = useRef();
  const frontTarget = useRef();

  const loader = new TextureLoader();
  // A png with transparency to use as the target sprite.
  const texture = loader.load("images/SpaceFox/target.png");

  // Update the position of both sprites based on the mouse x and y position. The front target has a larger scalar.
  // Its movement in both axis is exagerated since its farther in front. The end result should be the appearance that the
  // two targets are aligned with the ship in the direction of laser fire.
  useFrame(({ mouse }) => {
    rearTarget.current.position.y = -mouse.y * 10;
    rearTarget.current.position.x = -mouse.x * 30;

    frontTarget.current.position.y = -mouse.y * 20;
    frontTarget.current.position.x = -mouse.x * 60;
  });
  // Return a group containing two sprites. One positioned eight units in front of the ship, and the other 16 in front.
  // We give the spriteMaterial a map prop with the loaded sprite texture as a value/
  return (
    <group>
      <sprite position={[0, 0, -8]} ref={rearTarget}>
        <spriteMaterial attach="material" map={texture} />
      </sprite>
      <sprite position={[0, 0, -16]} ref={frontTarget}>
        <spriteMaterial attach="material" map={texture} />
      </sprite>
    </group>
  );
}

// Manages Drawing enemies that currently exist in state
function Enemies() {
  const enemies = useRecoilValue(enemyPositionState);
  return (
    <group>
      {enemies.map((enemy) => (
        <mesh position={[enemy.x, enemy.y, enemy.z]} key={`${enemy.x}`}>
          <sphereBufferGeometry attach="geometry" args={[2, 8, 8]} />
          <meshStandardMaterial attach="material" color="white" wireframe />
        </mesh>
      ))}
    </group>
  );
}

// An invisible clickable element in the front of the scene.
// Manages creating lasers with the correct initial velocity on click.
function LaserController() {
  const shipPosition = useRecoilValue(shipPositionState);
  const [lasers, setLasers] = useRecoilState(laserPositionState);
  return (
    <mesh
      position={[0, 0, -8]}
      onClick={() =>
        setLasers([
          ...lasers,
          {
            id: Math.random(),
            x: 0,
            y: 0,
            z: 0,
            velocity: [
              shipPosition.rotation.x * 6,
              shipPosition.rotation.y * 5,
            ],
          },
        ])
      }
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial
        attach="material"
        color="orange"
        emissive="#ff0860"
        visible={false}
      />
    </mesh>
  );
}

// Draws all of the lasers existing in state.
function Lasers() {
  const lasers = useRecoilValue(laserPositionState);
  return (
    <group>
      {lasers.map((laser) => (
        <mesh position={[laser.x, laser.y, laser.z]} key={`${laser.id}`}>
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" emissive="white" wireframe />
        </mesh>
      ))}
    </group>
  );
}

const CameraControls = () => {
  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls component.
  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      maxAzimuthAngle={Math.PI / 4}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Math.PI / 4}
      minPolarAngle={0}
    />
  );
};

export default function App() {
  return (
    <Canvas style={{ background: "black" }}>
      <RecoilRoot>
        <directionalLight intensity={0.5} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={<Loading />}>
          <ArWing />
        </Suspense>
        <Target />
        <Enemies />
        <Lasers />
        <Terrain />
        <LaserController />
      </RecoilRoot>
    </Canvas>
  );
}

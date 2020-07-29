import React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "react-three-fiber";
import "./styles.css";

function Sphere() {
  return (
    <mesh visible userData={{ test: "hello" }} position={[0, 0, 0]} castShadow>
      {" "}
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />{" "}
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        roughness={0.1}
        metalness={0.1}
      />{" "}
    </mesh>
  );
}

function App() {
  return (
    <Canvas>
      <Sphere />
    </Canvas>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

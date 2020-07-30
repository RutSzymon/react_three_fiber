import React from "react";
import ReactDOM from "react-dom";
import ThreePointLighting from "./experiments/ThreePointLighting";
import SkyboxApp from "./experiments/Skybox";
import SpaceFox from "./experiments/SpaceFox";

function App() {
  // return <ThreePointLighting />;
  // return <Skybox />;
  return <SpaceFox />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

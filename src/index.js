import React from "react";
import ReactDOM from "react-dom";
import ThreePointLighting from "./experiments/ThreePointLighting";
import SkyboxApp from "./experiments/Skybox";

function App() {
  // return <ThreePointLighting />;
  return <SkyboxApp />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

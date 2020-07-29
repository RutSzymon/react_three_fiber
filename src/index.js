import React from "react";
import ReactDOM from "react-dom";
import ThreePointLighting from "./experiments/ThreePointLighting";

function App() {
  return <ThreePointLighting />;
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

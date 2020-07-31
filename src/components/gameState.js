import { atom } from "recoil";

export const shipPositionState = atom({
  key: "shipPosition", // unique ID (with respect to other atoms/selectors)
  default: { position: {}, rotation: {} }, // default value (aka initial value)
});

export const enemyPositionState = atom({
  key: "enemyPosition", // unique ID (with respect to other atoms/selectors)
  default: [
    { x: -10, y: 10, z: -80 },
    { x: 20, y: 0, z: -100 },
  ], // default value (aka initial value)
});

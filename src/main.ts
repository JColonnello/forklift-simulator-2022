import * as THREE from "three";
import { ForkliftScript } from "./forklift";
import {KeyManager} from "./keyManager";
import {Key, keys} from "./object";
import { ScriptManager } from "./scriptManager";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

let scriptManager = new ScriptManager();

document.addEventListener("pointerup", ({ x, y }) =>
  scriptManager.dispatchPointerUp(x, y)
);
document.addEventListener("pointerdown", ({ x, y }) =>
  scriptManager.dispatchPointerDown(x, y)
);
document.addEventListener("pointermove", ({ x, y }) =>
  scriptManager.dispatchPointerMove(x, y)
);

function isKey(str: string): str is Key {
  return keys.includes(str as Key);
}

function convertKeyEvent(keyEvent: KeyboardEvent) {
  let upperCase = keyEvent.key.toUpperCase();

  if (isKey(upperCase)) {
	return upperCase;
  }

  throw new Error("Could not convert key.");
}

document.addEventListener("keyup", (event) => {
  scriptManager.dispatchKeyUp(convertKeyEvent(event));
});
document.addEventListener("keydown", (event) => {
  scriptManager.dispatchKeyDown(convertKeyEvent(event));
});


scriptManager.addScript((sm) => new KeyManager(scene, sm));
scriptManager.addScript((sm) => new ForkliftScript(cube, sm));

scriptManager.dispatchInit();

function animate() {
  let dt = clock.getDelta();
  requestAnimationFrame(animate);
  scriptManager.dispatchUpdate(dt);
  renderer.render(scene, camera);
}
clock.start();
animate();

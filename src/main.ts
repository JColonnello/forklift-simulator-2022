import * as THREE from "three";
import {AmbientLight, Mesh, MeshBasicMaterial, Object3D, PointLight, Sphere, SphereGeometry} from "three";
import { ForkliftScript } from "./forklift";
import {KeyManager} from "./keyManager";
import {Key, keys} from "./script";
import { ScriptManager } from "./scriptManager";
import * as OBJECTS from "./objects";

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


OBJECTS.addAmbientLight(scene);
OBJECTS.addLight(scene, -3, 3, -3);
OBJECTS.addLight(scene, 3, 3, 3);
let room = new Object3D();
room.position.set(0, -2, 0);
OBJECTS.addRoom(room, 10, 10, 10);
let cube = OBJECTS.addForklift(room);
scene.add(room);

camera.position.z = 5;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

let scriptManager = new ScriptManager();
scriptManager.setupEventListeners();

scriptManager.addScript(KeyManager.bind(null, scene));
scriptManager.addScript(ForkliftScript.bind(null, cube));

scriptManager.dispatchInit();

function animate() {
  let dt = clock.getDelta();
  requestAnimationFrame(animate);
  scriptManager.dispatchUpdate(dt);
  renderer.render(scene, camera);
}
clock.start();
animate();

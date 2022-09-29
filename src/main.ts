import * as THREE from "three";
import { Object3D } from "three";
import { ScriptManager } from "./scripts/scriptManager";
import * as OBJECTS from "./objects";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { setupGui } from "./gui";
import { Printer } from "./scripts/printer";
import {Root} from "./scripts/root";

setupGui((generator) => {
  const script = scriptManager.ofType<Printer>(Printer)!;
  script?.print(generator.build());
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;
camera.position.y = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
let room = new Object3D();
room.name = "room";
room.position.set(0, -0.5, 0);
OBJECTS.addRoom(room, 10, 10, 10);
OBJECTS.addForklift(room);

OBJECTS.addAmbientLight(scene);
OBJECTS.addLight(room, -3, 2, -3);
OBJECTS.addLight(room, 3, 2, 3);

OBJECTS.addPrinter(room);
OBJECTS.addShelf(room);

scene.add(room);

OBJECTS.addCameras(scene);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

let scriptManager = new ScriptManager();
scriptManager.setupEventListeners();

scriptManager.addScript(
  Root.bind(null, orbit),
  scene
);

scriptManager.dispatchInit();

function animate() {
  let dt = clock.getDelta();
  requestAnimationFrame(animate);
  scriptManager.dispatchUpdate(dt);
  renderer.render(scene, camera);
}
clock.start();
animate();

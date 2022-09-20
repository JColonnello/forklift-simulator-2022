import * as THREE from "three";
import {
  Object3D,
} from "three";
import { ForkliftScript } from "./scripts/forklift";
import { KeyManager } from "./scripts/keyManager";
import { ScriptManager } from "./scripts/scriptManager";
import * as OBJECTS from "./objects";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OrbitScript } from "./scripts/orbit";
import { TrayScript } from "./scripts/tray";
import { setupGui } from "./gui";
import { Printer } from "./scripts/printer";
import {SceneScript} from "./scripts/scene";
import {ShelfScript} from "./scripts/shelf";

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

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();

OBJECTS.addAmbientLight(scene);
OBJECTS.addLight(scene, -3, 3, -3);
OBJECTS.addLight(scene, 3, 3, 3);
let room = new Object3D();
room.position.set(0, -0.5, 0);
OBJECTS.addRoom(room, 10, 10, 10);
let forklift = OBJECTS.addForklift(room);
scene.add(room);

const printer = OBJECTS.addPrinter(room);
const shelf = OBJECTS.addShelf(room);

// Forklift POV
const forkliftCamera = new Object3D();
forkliftCamera.position.set(0, .2, 1);
//forklift.add(forkliftCamera);
scene.getObjectByName('tray')!.add(forkliftCamera);

// Forklift back camera
const backCamera = new Object3D();
backCamera.position.set(0, 0.5, 2);
forklift.add(backCamera);

// Forklift side camera
const sideCamera = new Object3D();
sideCamera.position.set(2, 0.5, 0);
sideCamera.rotateY(Math.PI / 2);
forklift.add(sideCamera);

// Printer camera
const printerCamera = new Object3D();
printerCamera.position.set(0, 1, 0);
printer.add(printerCamera);

// Shelf camera
const shelfCamera = new Object3D();
shelf.add(shelfCamera);

camera.position.z = 2;
camera.position.y = 1;

//room.add(camera)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

let scriptManager = new ScriptManager();
scriptManager.setupEventListeners();

scriptManager.addScript(SceneScript.bind(null, room));
scriptManager.addScript(KeyManager.bind(null, scene));
scriptManager.addScript(ForkliftScript.bind(null, forklift));
scriptManager.addScript(
  TrayScript.bind(null, forklift.getObjectByName("tray")!)
);
scriptManager.addScript(
  OrbitScript.bind(null, orbit, room, [
    { object: room, orbit: true },
    { object: printerCamera, orbit: true },
    { object: shelfCamera, orbit: true },
    { object: forkliftCamera, orbit: false },
    { object: backCamera, orbit: false },
    { object: sideCamera, orbit: false },
  ])
);
scriptManager.addScript(Printer.bind(null, printer));
scriptManager.addScript(ShelfScript.bind(null, shelf));

scriptManager.dispatchInit();

function animate() {
  let dt = clock.getDelta();
  requestAnimationFrame(animate);
  scriptManager.dispatchUpdate(dt);
  renderer.render(scene, camera);
}
clock.start();
animate();

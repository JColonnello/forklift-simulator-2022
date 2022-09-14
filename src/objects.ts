import {Object3D, Scene, Sphere, Vector3} from "three";
import * as THREE from "three";

export function addForklift(scene: Object3D) {
  let obj = new Object3D();

  const geometry = new THREE.BoxGeometry(.6, .5, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, .5, 0);
  cube.name = 'Forklift';

  function addWheel(name: string, x: number, y: number) {
    const geometry = new THREE.BoxGeometry(0.2, 0.5, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wheel = new THREE.Mesh(geometry, material);
    wheel.position.set(x * .3, .25, y * -.5);
    wheel.name = name;
    wheel.rotation.order = "ZYX";
    obj.add(wheel);
  }

  addWheel('front-right', 1, 1);
  addWheel('front-left', -1, 1);
  addWheel('back-right', 1, -1);
  addWheel('back-left', -1, -1);

  function addTray() {
    const trayOrigin = new Object3D();
    trayOrigin.position.set(0, 0.7, -0.8);
    const geometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFF00 });
    const tray = new THREE.Mesh(geometry, material);
    tray.name = "tray";
    trayOrigin.add(tray);
    obj.add(trayOrigin);
  }

  addTray();

  obj.add(cube)
  scene.add(obj);

  return obj;
}


export function addAmbientLight(scene: Scene) {
  const light = new THREE.AmbientLight(0xFFFFFF, 0.1);
  scene.add(light);

  return light;
}



export function addLight(scene: Scene, x: number, y: number, z: number) {
  const light = new THREE.PointLight(0xFFFFFF, 1, 100);
  light.position.set(x, y, z);
  scene.add(light);

  const lightGeometry = new THREE.SphereGeometry(0.2);
  const lightMaterial = new THREE.MeshBasicMaterial({color: light.color});
  const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
  lightMesh.position.copy(light.position);
  scene.add(lightMesh);

  return light;
}


function addPlane(scene: Object3D, x: number, y: number, z: number, width: number, height: number, rx: number, ry: number, material: THREE.Material) {
  const ground = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(ground, material);

  mesh.rotateX(rx * Math.PI / 2);
  mesh.rotateY(ry * Math.PI / 2);
  mesh.position.set(x, y, z);


  scene.add(mesh);

  return mesh;
}

// Adds a room where (0, 0, 0) is the center of the floor.
export function addRoom(scene: Object3D, length: number, width: number, height: number) {
  let obj = new THREE.Object3D();
  obj.position.set(0, height / 2, 0);

  // Floor and ceiling
  addPlane(obj, 0, -height / 2, 0, width, length, -1, 0, new THREE.MeshStandardMaterial({color: 0x661111}));
  addPlane(obj, 0, height / 2, 0, width, length, 1, 0, new THREE.MeshStandardMaterial({color: 0x222222}));


  let wallMaterial = new THREE.MeshStandardMaterial({color: 0x222222});
  // Back and front
  addPlane(obj, 0, 0, -length / 2, width, height, 0, 0, wallMaterial);
  addPlane(obj, 0, 0, length / 2, width, height, 2, 0, wallMaterial);

  // Left and Right
  addPlane(obj, -width / 2, 0, 0, length, height, 0, 1, wallMaterial);
  addPlane(obj, width / 2, 0, 0, length, height, 0, 3, wallMaterial);

  scene.add(obj);

  return obj;
}


export function addPrinter(scene: Object3D) {
  let obj = new THREE.Object3D();

  obj.position.set(3, 0, 3);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, .5, 0);
  cube.name = 'Printer';
  obj.add(cube);

  scene.add(obj);

  return obj;
}

export function addShelf(scene: Object3D) {
  let obj = new THREE.Object3D();

  obj.position.set(3, 0, -3);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00aa44 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, .5, 0);
  cube.name = 'Shelf';
  obj.add(cube);

  scene.add(obj);

  return obj;
}

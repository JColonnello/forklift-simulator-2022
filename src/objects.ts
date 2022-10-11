import * as THREE from "three";
import { Object3D, Scene } from "three";

export function addForklift(scene: Object3D) {
  let obj = new Object3D();
  obj.name = 'forklift';

  const geometry = new THREE.BoxGeometry(.6, .35, 1.2);
  const material = new THREE.MeshStandardMaterial({ color: 0x22a592 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, .5, 0);

  function addRoller(pos: number) {
    const geometry = new THREE.BoxGeometry(.04, 2.1, .04);
    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const roller = new THREE.Mesh(geometry, material);
    roller.position.set(pos * .2, .8, -.6);
    cube.add(roller);
  }

  addRoller(-1);
  addRoller(1);

  obj.add(cube)

  function addWheel(name: string, x: number, y: number) {
    //const geometry = new THREE.BoxGeometry(0.2, 0.5, 0.5);
    const geometry = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 10);
    geometry.rotateZ(Math.PI / 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const wheel = new THREE.Mesh(geometry, material);
    wheel.position.set(x * .4, .25, y * -.4);
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
    trayOrigin.position.set(0, 0.3, -0.8);
    const geometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
    geometry.translate(0, -0.05/2, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0xfea617 });
    const tray = new THREE.Mesh(geometry, material);
    tray.name = "tray";
    trayOrigin.add(tray);
    obj.add(trayOrigin);
  }

  addTray();

  function addEye(name: string, x: number) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.025, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const eye = new THREE.Mesh(geometry, material);
    eye.name = name;
    eye.position.set(x * 0.35, 0.5, -0.6);
    eye.rotateX(Math.PI / 2);

    function addPupil() {
      const geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 10);
      const material = new THREE.MeshStandardMaterial({ color: 0 });
      const pupil = new THREE.Mesh(geometry, material);
      pupil.name = "pupil";
      pupil.position.setY(-0.027);
      
      eye.add(pupil);
    }

    addPupil();

    obj.add(eye);
  }

  addEye('left-eye', -1);
  addEye('right-eye', 1);

  scene.add(obj);

  return obj;
}


export function addAmbientLight(scene: Scene) {
  const light = new THREE.AmbientLight(0xFFFFFF, 0.1);
  scene.add(light);

  return light;
}



export function addLight(scene: Object3D, x: number, y: number, z: number) {
  const lightHolder = new Object3D();

  const light = new THREE.PointLight(0xFFFFFF, 1, 100);

  const lightGeometry = new THREE.SphereGeometry(0.2);
  const lightMaterial = new THREE.MeshBasicMaterial({color: light.color});
  const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
  lightMesh.position.setY(lightGeometry.parameters.radius);
  lightMesh.add(light);

  lightHolder.position.set(x, y, z)
  lightHolder.add(lightMesh);

  scene.add(lightHolder);

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
  obj.name = 'printer';

  function addCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, .5, 0);
    return cube;
  }
  const cube = addCube();

  const platform = new Object3D()
  platform.position.set(0, .5, 0);
  platform.name = 'printer-platform';
  cube.add(platform);

  obj.add(cube);

  scene.add(obj);

  function addHead() {
    const geometry = new THREE.BoxGeometry(1, 0.05, 1);
    geometry.translate(0, geometry.parameters.height/2, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const head = new THREE.Mesh(geometry, material);
    head.name = 'printer-head';
    head.position.set(0, 1, 0);

    function addHeadOffset() {
      const headOffset = new Object3D();
      headOffset.name = 'printer-head-offset';

      head.add(headOffset)
    }
    addHeadOffset()

    platform.add(head);
  }

  function addGuide(p: number) {
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const guide = new THREE.Mesh(geometry, material);
    guide.name = 'printer-guide';
    guide.position.set(0.4, 0.5, p);
    platform.add(guide);
  }

  addHead();
  addGuide(0.1);
  addGuide(-0.1);

  return obj;
}

export function addShelf(scene: Object3D) {
  let obj = new THREE.Object3D();

  //obj.rotateY(-Math.PI / 2);
  obj.position.set(0, 0, -4.5);
  obj.name = 'shelf';

  //const geometry = new THREE.BoxGeometry(1, 1, 1);
  //const material = new THREE.MeshStandardMaterial({ color: 0x00aa44 });
  //const cube = new THREE.Mesh(geometry, material);
  const cube = new Object3D();

  cube.position.set(0, .5, 0);
  obj.add(cube);

  scene.add(obj);

  return obj;
}

export function addCameras(scene: Object3D) {
  const forklift = scene.getObjectByName('forklift')!;
  const printer = scene.getObjectByName('printer')!;
  const shelf = scene.getObjectByName('shelf')!;

  // Room Camera
  const roomCamera = new Object3D();
  roomCamera.name = "room-camera";
  scene.add(roomCamera);

  // Forklift POV
  const forkliftCamera = new Object3D();
  forkliftCamera.name = "forklift-camera";
  forkliftCamera.position.set(0, 0.2, 1);
  //forklift.add(forkliftCamera);
  forklift.getObjectByName("tray")!.add(forkliftCamera);

  // Forklift front camera
  const frontCamera = new Object3D();
  frontCamera.name = "front-camera";
  frontCamera.position.set(0, 1.5, -2);
  frontCamera.rotateY(Math.PI);
  frontCamera.rotateX(-Math.PI / 6);
  forklift.add(frontCamera);

  // Forklift back camera
  const backCamera = new Object3D();
  backCamera.name = "back-camera";
  backCamera.position.set(0, 1.5, 2);
  forklift.add(backCamera);

  // Forklift side camera
  const sideCamera = new Object3D();
  sideCamera.name = "side-camera";
  sideCamera.position.set(2, 0.5, 0);
  sideCamera.rotateY(Math.PI / 2);
  forklift.add(sideCamera);

  // Printer camera
  const printerCamera = new Object3D();
  printerCamera.name = "printer-camera";
  printerCamera.position.set(0, 1, 0);
  printer.add(printerCamera);

  // Shelf camera
  const shelfCamera = new Object3D();
  shelfCamera.name = "shelf-camera";
  shelf.add(shelfCamera);
}

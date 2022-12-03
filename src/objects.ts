import * as THREE from "three";
import { CubeCamera, Object3D, RepeatWrapping, Scene, Vector2 } from "three";
import { loadTexture } from "./textures";

export function addForklift(scene: Object3D) {
  let obj = new Object3D();
  obj.name = "forklift";
  const geometry = new THREE.BoxGeometry(0.6, 0.35, 1.2);
  const texture = loadTexture("texturaGrua.jpg");
  texture.repeat = new Vector2(2, 2);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0);

  function addRoller(pos: number) {
    const geometry = new THREE.BoxGeometry(0.04, 2.1, 0.04);
    const material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      shininess: 100,
    });
    const roller = new THREE.Mesh(geometry, material);
    roller.position.set(pos * 0.2, 0.8, -0.6);
    cube.add(roller);
  }

  addRoller(-1);
  addRoller(1);

  obj.add(cube);
  const wheelTexture = loadTexture("rueda.jpg");

  function addWheel(name: string, x: number, y: number) {
    //const geometry = new THREE.BoxGeometry(0.2, 0.5, 0.5);
    const wheelRadius = 0.25;
    const geometry = new THREE.CylinderGeometry(
      wheelRadius,
      wheelRadius,
      0.2,
      10,
      1,
      true
    );
    geometry.rotateZ(Math.PI / 2);

    const material = new THREE.MeshPhongMaterial({
      color: 0x2a2930,
      wireframe: false,
    });
    const wheel = new THREE.Mesh(geometry, material);

    function addCap(side: number) {
      const capGeometry = new THREE.CircleGeometry(
        geometry.parameters.radiusTop,
        geometry.parameters.radialSegments
      );
      capGeometry.rotateY((side * Math.PI) / 2);
      capGeometry.translate((side * geometry.parameters.height) / 2, 0, 0);
      const capMaterial = new THREE.MeshPhongMaterial({ map: wheelTexture });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      wheel.add(cap);
    }

    addCap(-1);
    addCap(1);
    wheel.position.set(x * 0.4, wheelRadius, y * -0.4);
    wheel.name = name;
    wheel.rotation.order = "ZYX";
    obj.add(wheel);
  }

  addWheel("front-right", 1, 1);
  addWheel("front-left", -1, 1);
  addWheel("back-right", 1, -1);
  addWheel("back-left", -1, -1);

  function addTray() {
    const trayOrigin = new Object3D();
    trayOrigin.position.set(0, 0.3, -0.8);
    const geometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
    geometry.translate(0, -0.05 / 2, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0xfea617 });
    const tray = new THREE.Mesh(geometry, material);
    tray.name = "tray";
    trayOrigin.add(tray);
    obj.add(trayOrigin);
  }

  addTray();

  function addEye(name: string, x: number) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.025, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 100,
    });
    const eye = new THREE.Mesh(geometry, material);
    eye.name = name;
    eye.position.set(x * 0.35, 0.5, -0.6);
    eye.rotateX(Math.PI / 2);

    function addPupil() {
      const geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 10);
      const material = new THREE.MeshPhongMaterial({
        color: 0,
        shininess: 100,
      });
      const pupil = new THREE.Mesh(geometry, material);
      pupil.name = "pupil";
      pupil.position.setY(-0.027);

      eye.add(pupil);
    }

    addPupil();

    obj.add(eye);
  }

  addEye("left-eye", -1);
  addEye("right-eye", 1);

  scene.add(obj);

  return obj;
}

export function addAmbientLight(scene: Scene) {
  const light = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(light);

  return light;
}

export function addLight(scene: Object3D, x: number, y: number, z: number) {
  const lightHolder = new Object3D();

  const light = new THREE.SpotLight(0xffffff, 0.8, 0, 0.3, 1);
  //light.target = scene.getObjectByName("forklift")!;
  const lightTarget = new THREE.Object3D();
  lightHolder.add(lightTarget);
  lightTarget.position.add(new THREE.Vector3(0, -10, 0));
  light.target = lightTarget;

  const lightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1);
  const lightMaterial = new THREE.MeshBasicMaterial({ color: light.color });
  const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
  lightMesh.position.setY(lightGeometry.parameters.radiusTop);
  lightMesh.add(light);

  lightHolder.position.set(x, y, z);
  lightHolder.add(lightMesh);

  scene.add(lightHolder);

  return light;
}

function addPlane(
  scene: Object3D,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  rx: number,
  ry: number,
  material: THREE.Material
) {
  const ground = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(ground, material);

  mesh.rotateX((rx * Math.PI) / 2);
  mesh.rotateY((ry * Math.PI) / 2);
  mesh.position.set(x, y, z);

  scene.add(mesh);

  return mesh;
}

// Adds a room where (0, 0, 0) is the center of the floor.
export function addRoom(
  scene: Object3D,
  length: number,
  width: number,
  height: number
) {
  let obj = new THREE.Object3D();
  obj.position.set(0, height / 2, 0);

  const floorTexture = loadTexture("StoneTilesFloor01_1K_BaseColor.png");
  floorTexture.repeat = new Vector2(5, 5);
  floorTexture.wrapS = RepeatWrapping;
  floorTexture.wrapT = RepeatWrapping;
  // Floor and ceiling
  addPlane(
    obj,
    0,
    -height / 2,
    0,
    width,
    length,
    -1,
    0,
    new THREE.MeshPhongMaterial({ map: floorTexture })
  );
  addPlane(
    obj,
    0,
    height / 2,
    0,
    width,
    length,
    1,
    0,
    new THREE.MeshPhongMaterial({ color: 0x222222 })
  );

  const wallTexture = loadTexture("CorrugatedMetalPanel02_1K_BaseColor.png");
  wallTexture.repeat = new Vector2(3, 3);
  wallTexture.wrapS = RepeatWrapping;
  wallTexture.wrapT = RepeatWrapping;
  let wallMaterial = new THREE.MeshPhongMaterial({
    color: 0x444444,
    map: wallTexture,
  });
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
  obj.name = "printer";

  function addCube() {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 20, 5);
    //const geometry = new THREE.SphereGeometry(0.5);
    let cubeCamera: CubeCamera | undefined;

    let envCube = new THREE.CubeTextureLoader()
      .setPath("assets/textures/greyRoom1/")
      .load([
        "greyRoom1_front.jpg",
        "greyRoom1_back.jpg",
        "greyRoom1_top.jpg",
        "greyRoom1_bottom.jpg",
        "greyRoom1_right.jpg",
        "greyRoom1_left.jpg",
      ]);

    //const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
    //cubeRenderTarget.texture.type = THREE.HalfFloatType;

    //cubeCamera = new THREE.CubeCamera(0.5, 1000, cubeRenderTarget);
    //envCube = cubeRenderTarget.texture;

    const material = new THREE.MeshStandardMaterial({
      envMap: envCube,
      metalness: 1,
      roughness: 0.1,
    });
    const cube = new THREE.Mesh(geometry, material);
    //cube.add(cubeCamera)
    cube.position.set(0, 0.5, 0);
    return [cube, cubeCamera] as const;
  }
  const [cube, cubeCamera] = addCube();

  const platform = new Object3D();
  platform.position.set(0, 0.5, 0);
  platform.name = "printer-platform";
  cube.add(platform);

  obj.add(cube);

  scene.add(obj);

  function addHead() {
    function addLight(x: number, y: number, z: number) {
      const lightHolder = new Object3D();

      const light = new THREE.PointLight(0xffffff, 0.7, 2);

      const lightGeometry = new THREE.SphereGeometry(0.05);
      const lightMaterial = new THREE.MeshBasicMaterial({ color: light.color });
      const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
      lightMesh.position.setY(lightGeometry.parameters.radius);
      lightMesh.add(light);

      lightHolder.position.set(x, y, z);
      lightHolder.add(lightMesh);

      head.add(lightHolder);

      return light;
    }

    const side = 0.9;
    const geometry = new THREE.BoxGeometry(side, 0.025, side);
    geometry.translate(0, geometry.parameters.height / 2, 0);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const head = new THREE.Mesh(geometry, material);
    head.name = "printer-head";
    head.position.set(0, 1, 0);

    addLight(side / 2, -0.0375, side / 2);
    addLight(-side / 2, -0.0375, side / 2);
    addLight(-side / 2, -0.0375, -side / 2);
    addLight(side / 2, -0.0375, -side / 2);

    function addHeadOffset() {
      const headOffset = new Object3D();
      headOffset.name = "printer-head-offset";

      head.add(headOffset);
    }
    addHeadOffset();

    platform.add(head);
  }

  function addGuide(p: number) {
    const geometry = new THREE.CylinderGeometry(0.025, 0.025, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa,
      shininess: 100,
    });
    const guide = new THREE.Mesh(geometry, material);
    guide.name = "printer-guide";
    guide.position.set(0.4, 0.5, p);
    platform.add(guide);
  }

  addHead();
  addGuide(0.1);
  addGuide(-0.1);

  return [obj, cubeCamera] as const;
}

export function addShelf(scene: Object3D) {
  let obj = new THREE.Object3D();

  obj.position.set(0, 0, -4.5);
  obj.name = "shelf";

  const cube = new Object3D();

  cube.position.set(0, 0.5, 0);
  obj.add(cube);

  scene.add(obj);

  return obj;
}

export function addCameras(scene: Object3D) {
  const forklift = scene.getObjectByName("forklift")!;
  const printer = scene.getObjectByName("printer")!;
  const shelf = scene.getObjectByName("shelf")!;

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

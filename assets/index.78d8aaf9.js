var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _height, _platform, _head, _headOffset;
import * as THREE from "three";
import { Object3D, Vector3, Vector2, ExtrudeGeometry, Quaternion, LatheGeometry, Shape, Plane, MeshStandardMaterial, DoubleSide, Mesh, Euler } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "dat.gui";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  " ",
  ...`[{}];:"'\\|/?.>,<~!@#$%^&*()_+`,
  ..."`1234567890-=",
  "ArrowDown",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "Alt",
  "Control",
  "Shift",
  "Enter",
  "Backspace",
  "OS",
  "Meta",
  "Escape"
];
class Script {
  constructor(object, scriptManager2) {
    __publicField(this, "object");
    __publicField(this, "scriptManager");
    this.object = object;
    this.scriptManager = scriptManager2;
  }
  get childrenScripts() {
    return {};
  }
  update(_dt) {
  }
  init() {
  }
  keydown(_key) {
  }
  keyup(_key) {
  }
  pointerdown(_x, _y) {
  }
  pointerup(_x, _y) {
  }
  pointermove(_x, _y) {
  }
}
function isScriptMapWithChildren(sm) {
  return !(sm instanceof Function) && !(sm instanceof Array) && sm.scripts !== void 0;
}
function normalize(sm) {
  var _a;
  if (sm instanceof Function) {
    return { scripts: [sm], children: {} };
  }
  if (sm instanceof Array) {
    return { scripts: sm, children: {} };
  }
  if (isScriptMapWithChildren(sm)) {
    let scripts = (_a = sm.scripts) != null ? _a : [];
    return { scripts: scripts instanceof Array ? scripts : [scripts], children: sm.children };
  }
  return { scripts: [], children: sm };
}
class ScriptManager {
  constructor() {
    __publicField(this, "scripts", []);
  }
  addScript(scriptBuilder, object) {
    const script = new scriptBuilder(object, this);
    this.scripts.push(script);
    this.addAll(script.childrenScripts, object);
    return script;
  }
  addAll(scriptMap, root) {
    const { scripts, children } = normalize(scriptMap);
    for (const script of scripts) {
      this.addScript(script, root);
    }
    for (const child in children) {
      const element = children[child];
      this.addAll(element, root.getObjectByName(child));
    }
  }
  removeScript(script) {
    let i = this.scripts.indexOf(script);
    this.scripts.splice(i);
  }
  removeScriptOfType(scriptType) {
    let script = this.ofType(scriptType);
    if (script == null)
      return;
    this.removeScript(script);
  }
  ofType(scriptType) {
    for (let script of this.scripts) {
      if (script instanceof scriptType) {
        return script;
      }
    }
    return null;
  }
  setupEventListeners() {
    document.addEventListener(
      "pointerup",
      ({ x, y }) => this.dispatchPointerUp(x, y)
    );
    document.addEventListener(
      "pointerdown",
      ({ x, y }) => this.dispatchPointerDown(x, y)
    );
    document.addEventListener(
      "pointermove",
      ({ x, y }) => this.dispatchPointerMove(x, y)
    );
    function isKey(str) {
      return keys.includes(str);
    }
    function convertKeyEvent(keyEvent) {
      let key = keyEvent.key;
      if (keyEvent.key.length == 1) {
        key = key.toUpperCase();
      }
      if (isKey(key)) {
        return key;
      }
      throw new Error(`Could not convert key ${keyEvent.key}.`);
    }
    document.addEventListener("keyup", (event) => {
      this.dispatchKeyUp(convertKeyEvent(event));
    });
    document.addEventListener("keydown", (event) => {
      this.dispatchKeyDown(convertKeyEvent(event));
    });
  }
  dispatchUpdate(dt) {
    this.scripts.forEach((s) => s.update(dt));
  }
  dispatchPointerDown(x, y) {
    this.scripts.forEach((s) => s.pointerdown(x, y));
  }
  dispatchPointerUp(x, y) {
    this.scripts.forEach((s) => s.pointerup(x, y));
  }
  dispatchPointerMove(x, y) {
    this.scripts.forEach((s) => s.pointermove(x, y));
  }
  dispatchKeyDown(key) {
    this.scripts.forEach((s) => s.keydown(key));
  }
  dispatchKeyUp(key) {
    this.scripts.forEach((s) => s.keyup(key));
  }
  dispatchInit() {
    this.scripts.forEach((s) => s.init());
  }
}
function addForklift(scene2) {
  let obj = new Object3D();
  obj.name = "forklift";
  const geometry = new THREE.BoxGeometry(0.6, 0.35, 1.2);
  const material2 = new THREE.MeshStandardMaterial({ color: 2270610 });
  const cube = new THREE.Mesh(geometry, material2);
  cube.position.set(0, 0.5, 0);
  function addRoller(pos) {
    const geometry2 = new THREE.BoxGeometry(0.04, 2.1, 0.04);
    const material22 = new THREE.MeshStandardMaterial({ color: 11184810 });
    const roller = new THREE.Mesh(geometry2, material22);
    roller.position.set(pos * 0.2, 0.8, -0.6);
    cube.add(roller);
  }
  addRoller(-1);
  addRoller(1);
  obj.add(cube);
  const wheelTexture = new THREE.TextureLoader().load("assets/textures/rueda.jpg");
  function addWheel(name, x, y) {
    const geometry2 = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 10, 1, true);
    geometry2.rotateZ(Math.PI / 2);
    const material22 = new THREE.MeshPhongMaterial({ color: 2763056, wireframe: false });
    const wheel = new THREE.Mesh(geometry2, material22);
    function addCap(side) {
      const capGeometry = new THREE.CircleGeometry(geometry2.parameters.radiusTop, geometry2.parameters.radialSegments);
      capGeometry.rotateY(side * Math.PI / 2);
      capGeometry.translate(side * geometry2.parameters.height / 2, 0, 0);
      const capMaterial = new THREE.MeshPhongMaterial({ map: wheelTexture });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      wheel.add(cap);
    }
    addCap(-1);
    addCap(1);
    wheel.position.set(x * 0.4, 0.25, y * -0.4);
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
    const geometry2 = new THREE.BoxGeometry(0.5, 0.05, 0.5);
    geometry2.translate(0, -0.05 / 2, 0);
    const material22 = new THREE.MeshStandardMaterial({ color: 16688663 });
    const tray = new THREE.Mesh(geometry2, material22);
    tray.name = "tray";
    trayOrigin.add(tray);
    obj.add(trayOrigin);
  }
  addTray();
  function addEye(name, x) {
    const geometry2 = new THREE.CylinderGeometry(0.1, 0.1, 0.025, 10);
    const material22 = new THREE.MeshStandardMaterial({ color: 16777215 });
    const eye = new THREE.Mesh(geometry2, material22);
    eye.name = name;
    eye.position.set(x * 0.35, 0.5, -0.6);
    eye.rotateX(Math.PI / 2);
    function addPupil() {
      const geometry3 = new THREE.CylinderGeometry(0.03, 0.03, 0.01, 10);
      const material3 = new THREE.MeshStandardMaterial({ color: 0 });
      const pupil = new THREE.Mesh(geometry3, material3);
      pupil.name = "pupil";
      pupil.position.setY(-0.027);
      eye.add(pupil);
    }
    addPupil();
    obj.add(eye);
  }
  addEye("left-eye", -1);
  addEye("right-eye", 1);
  scene2.add(obj);
  return obj;
}
function addAmbientLight(scene2) {
  const light = new THREE.AmbientLight(16777215, 0.3);
  scene2.add(light);
  return light;
}
function addLight(scene2, x, y, z) {
  const lightHolder = new Object3D();
  const light = new THREE.PointLight(16777215, 1, 100);
  const lightGeometry = new THREE.SphereGeometry(0.2);
  const lightMaterial = new THREE.MeshBasicMaterial({ color: light.color });
  const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
  lightMesh.position.setY(lightGeometry.parameters.radius);
  lightMesh.add(light);
  lightHolder.position.set(x, y, z);
  lightHolder.add(lightMesh);
  scene2.add(lightHolder);
  return light;
}
function addPlane(scene2, x, y, z, width, height, rx, ry, material2) {
  const ground = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(ground, material2);
  mesh.rotateX(rx * Math.PI / 2);
  mesh.rotateY(ry * Math.PI / 2);
  mesh.position.set(x, y, z);
  scene2.add(mesh);
  return mesh;
}
function addRoom(scene2, length, width, height) {
  let obj = new THREE.Object3D();
  obj.position.set(0, height / 2, 0);
  addPlane(obj, 0, -height / 2, 0, width, length, -1, 0, new THREE.MeshStandardMaterial({ color: 6689041 }));
  addPlane(obj, 0, height / 2, 0, width, length, 1, 0, new THREE.MeshStandardMaterial({ color: 2236962 }));
  let wallMaterial = new THREE.MeshStandardMaterial({ color: 2236962 });
  addPlane(obj, 0, 0, -length / 2, width, height, 0, 0, wallMaterial);
  addPlane(obj, 0, 0, length / 2, width, height, 2, 0, wallMaterial);
  addPlane(obj, -width / 2, 0, 0, length, height, 0, 1, wallMaterial);
  addPlane(obj, width / 2, 0, 0, length, height, 0, 3, wallMaterial);
  scene2.add(obj);
  return obj;
}
function addPrinter(scene2) {
  let obj = new THREE.Object3D();
  obj.position.set(3, 0, 3);
  obj.name = "printer";
  function addCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshStandardMaterial({ color: 255 });
    const cube2 = new THREE.Mesh(geometry, material2);
    cube2.position.set(0, 0.5, 0);
    return cube2;
  }
  const cube = addCube();
  const platform = new Object3D();
  platform.position.set(0, 0.5, 0);
  platform.name = "printer-platform";
  cube.add(platform);
  obj.add(cube);
  scene2.add(obj);
  function addHead() {
    const geometry = new THREE.BoxGeometry(1, 0.05, 1);
    geometry.translate(0, geometry.parameters.height / 2, 0);
    const material2 = new THREE.MeshStandardMaterial({ color: 65280 });
    const head = new THREE.Mesh(geometry, material2);
    head.name = "printer-head";
    head.position.set(0, 1, 0);
    function addHeadOffset() {
      const headOffset = new Object3D();
      headOffset.name = "printer-head-offset";
      head.add(headOffset);
    }
    addHeadOffset();
    platform.add(head);
  }
  function addGuide(p) {
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1);
    const material2 = new THREE.MeshStandardMaterial({ color: 11184810 });
    const guide = new THREE.Mesh(geometry, material2);
    guide.name = "printer-guide";
    guide.position.set(0.4, 0.5, p);
    platform.add(guide);
  }
  addHead();
  addGuide(0.1);
  addGuide(-0.1);
  return obj;
}
function addShelf(scene2) {
  let obj = new THREE.Object3D();
  obj.position.set(0, 0, -4.5);
  obj.name = "shelf";
  const cube = new Object3D();
  cube.position.set(0, 0.5, 0);
  obj.add(cube);
  scene2.add(obj);
  return obj;
}
function addCameras(scene2) {
  const forklift = scene2.getObjectByName("forklift");
  const printer = scene2.getObjectByName("printer");
  const shelf = scene2.getObjectByName("shelf");
  const roomCamera = new Object3D();
  roomCamera.name = "room-camera";
  scene2.add(roomCamera);
  const forkliftCamera = new Object3D();
  forkliftCamera.name = "forklift-camera";
  forkliftCamera.position.set(0, 0.2, 1);
  forklift.getObjectByName("tray").add(forkliftCamera);
  const frontCamera = new Object3D();
  frontCamera.name = "front-camera";
  frontCamera.position.set(0, 1.5, -2);
  frontCamera.rotateY(Math.PI);
  frontCamera.rotateX(-Math.PI / 6);
  forklift.add(frontCamera);
  const backCamera = new Object3D();
  backCamera.name = "back-camera";
  backCamera.position.set(0, 1.5, 2);
  forklift.add(backCamera);
  const sideCamera = new Object3D();
  sideCamera.name = "side-camera";
  sideCamera.position.set(2, 0.5, 0);
  sideCamera.rotateY(Math.PI / 2);
  forklift.add(sideCamera);
  const printerCamera = new Object3D();
  printerCamera.name = "printer-camera";
  printerCamera.position.set(0, 1, 0);
  printer.add(printerCamera);
  const shelfCamera = new Object3D();
  shelfCamera.name = "shelf-camera";
  shelf.add(shelfCamera);
}
function mergeVertices(geometry, presicionDigits = 3) {
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const indices = geometry.getIndex();
  const map = /* @__PURE__ */ new Map();
  function getVecHash(v) {
    const x = v.x.toFixed(presicionDigits);
    const y = v.y.toFixed(presicionDigits);
    const z = v.z.toFixed(presicionDigits);
    return `${x},${y},${z}`;
  }
  if (position.count != normal.count) {
    throw "There should be the same amount of positions as normals";
  }
  const count = position.count;
  const indexMap = /* @__PURE__ */ new Map();
  const p = new Vector3();
  for (let i = 0; i < count; i++) {
    p.set(
      position.array[i * position.itemSize + 0],
      position.array[i * position.itemSize + 1],
      position.array[i * position.itemSize + 2]
    );
    const posHash = getVecHash(p);
    const newIndex = map.get(posHash);
    if (newIndex === void 0) {
      map.set(posHash, i);
    }
    indexMap.set(i, newIndex != null ? newIndex : i);
  }
  const newIndices = [];
  if (indices !== null) {
    for (let i = 0; i < indices.count; i++) {
      let index = indices.array[i];
      newIndices.push(indexMap.get(index));
    }
  } else {
    for (let i = 0; i < count; i++) {
      p.set(
        position.array[i * position.itemSize + 0],
        position.array[i * position.itemSize + 1],
        position.array[i * position.itemSize + 2]
      );
      const posHash = getVecHash(p);
      newIndices.push(map.get(posHash));
    }
  }
  geometry.setIndex(newIndices);
  return geometry;
}
const solidTypes = ["Sweep", "Revolve"];
const sweepShapes = ["B1", "B2", "B3", "B4"];
const revolveShapes = ["A1", "A2", "A3", "A4"];
class ModelGenerator {
  build() {
    var geometry = this.generate();
    geometry = mergeVertices(geometry);
    geometry.computeVertexNormals();
    return geometry;
  }
}
function mirrorVertices(vertices, axis) {
  return [...vertices, ...vertices.slice(0, -1).map((v) => new Vector3(v.x, v.y).reflect(new Vector3(axis.x, axis.y).normalize())).map((v) => new Vector2(v.x, v.y)).reverse()];
}
class ShapeWithSubdividedLines extends Shape {
  lineTo(x, y) {
    this.splineThru([new Vector2(x, y)]);
    return this;
  }
}
function generateShape(shapeType) {
  switch (shapeType) {
    case "A1":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", false);
          __publicField(this, "canRevolve", true);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(0, 0);
            shape.lineTo(-4 / 12, 0);
            shape.lineTo(-4 / 12, 2 / 12);
            shape.splineThru([new Vector2(-1 / 12, 3 / 12), new Vector2(-3 / 12, 6 / 12), new Vector2(-1 / 12, 6 / 12 + 6 / 12 - 3 / 12)]);
            shape.lineTo(-4 / 12, 1 - 2 / 12);
            shape.lineTo(-4 / 12, 1);
            shape.lineTo(0, 1);
            return shape;
          });
        }
      }();
    case "A2":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", false);
          __publicField(this, "canRevolve", true);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(0, 0);
            shape.splineThru([new Vector2(-30 / 175, 1 / 175), new Vector2(-52 / 175, 24 / 175), new Vector2(-32 / 175, 88 / 175)]);
            shape.lineTo(-32 / 175, 103 / 175);
            shape.splineThru([new Vector2(-39 / 175, 120 / 175), new Vector2(-50 / 175, 138 / 175), new Vector2(-55 / 175, 148 / 175)]);
            shape.lineTo(-55 / 175, 155 / 175);
            shape.splineThru([new Vector2(-50 / 175, 159 / 175), new Vector2(-40 / 175, 165 / 175), new Vector2(-38 / 175, 175 / 175)]);
            return shape;
          });
        }
      }();
    case "A3":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", false);
          __publicField(this, "canRevolve", true);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(0, 0);
            shape.lineTo(-91 / 179, 0);
            shape.lineTo(-23 / 179, 32 / 179);
            shape.lineTo(-23 / 179, 48 / 179);
            shape.splineThru([new Vector2(-45 / 179, 57 / 179), new Vector2(-65 / 179, 70 / 179), new Vector2(-73 / 179, 87 / 179)]);
            shape.splineThru([new Vector2(-73 / 179, 122 / 179), new Vector2(-72 / 179, 133 / 179), new Vector2(-72 / 179, 143 / 179)]);
            shape.splineThru([new Vector2(-61 / 179, 158 / 179), new Vector2(-42 / 179, 162 / 179), new Vector2(-32 / 179, 179 / 179)]);
            return shape;
          });
        }
      }();
    case "A4":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", false);
          __publicField(this, "canRevolve", true);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(0, 0);
            shape.lineTo(-40 / 180, 0);
            shape.splineThru([new Vector2(-53 / 180, 4 / 180), new Vector2(-61 / 180, 14 / 180), new Vector2(-63 / 180, 28 / 180)]);
            shape.splineThru([new Vector2(-54 / 180, 39 / 180), new Vector2(-33 / 180, 44 / 180), new Vector2(-24 / 180, 55 / 180)]);
            shape.splineThru([new Vector2(-26 / 180, 75 / 180), new Vector2(-49 / 180, 93 / 180), new Vector2(-95 / 180, 102 / 180)]);
            shape.splineThru([new Vector2(-69 / 180, 107 / 180), new Vector2(-48 / 180, 120 / 180), new Vector2(-43 / 180, 145 / 180)]);
            shape.splineThru([new Vector2(-35 / 180, 163 / 180), new Vector2(-20 / 180, 176 / 180), new Vector2(-3 / 180, 180 / 180)]);
            return shape;
          });
        }
      }();
    case "B1":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", true);
          __publicField(this, "canRevolve", false);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3));
            shape.lineTo(Math.cos(Math.PI), Math.sin(Math.PI));
            shape.lineTo(Math.cos(-Math.PI / 3), Math.sin(-Math.PI / 3));
            shape.lineTo(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3));
            return shape;
          });
        }
      }();
    case "B2":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", true);
          __publicField(this, "canRevolve", false);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            let ang = 0;
            shape.moveTo(Math.cos(ang), Math.sin(ang));
            for (let i = 1; i < 7 * 2; ) {
              ang = Math.PI / 7 * i++;
              const p1 = new Vector2(Math.cos(ang), Math.sin(ang)).multiplyScalar(0.6);
              ang = Math.PI / 7 * i++;
              const p2 = new Vector2(Math.cos(ang), Math.sin(ang));
              shape.splineThru([p1, p2]);
            }
            return shape;
          });
        }
      }();
    case "B3":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", true);
          __publicField(this, "canRevolve", false);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(0.3, 0.5);
            let vectors = [
              new Vector2(-0.3, 0.5),
              new Vector2(-0.3, 1),
              new Vector2(-0.7, 1),
              new Vector2(-0.9, 0.9)
            ];
            vectors = mirrorVertices(vectors, new Vector2(1, 1));
            const center = new Vector2(0, 0);
            for (let i = 0; i < 4; i++) {
              const v = vectors.map((v2) => v2.clone().rotateAround(center, Math.PI / 2 * i));
              shape.lineTo(v[0].x, v[0].y);
              shape.lineTo(v[1].x, v[1].y);
              shape.lineTo(v[2].x, v[2].y);
              shape.splineThru([v[3], v[4]]);
              shape.lineTo(v[5].x, v[5].y);
              shape.lineTo(v[6].x, v[6].y);
            }
            return shape;
          });
        }
      }();
    case "B4":
      return new class {
        constructor() {
          __publicField(this, "canExtrude", true);
          __publicField(this, "canRevolve", false);
          __publicField(this, "generate", () => {
            let shape = new ShapeWithSubdividedLines();
            shape.moveTo(0.5, -0.65);
            shape.lineTo(0.5, 0.65);
            let v = new Vector2(0.5, 0.65);
            let center = new Vector2(0, 0.65);
            shape.splineThru(new Array(5).fill(0).map((_, i, a) => v.clone().rotateAround(center, Math.PI / a.length * (i + 1))));
            shape.lineTo(-0.5, -0.65);
            v = new Vector2(-0.5, -0.65);
            center = new Vector2(0, -0.65);
            shape.splineThru(new Array(5).fill(0).map((_, i, a) => v.clone().rotateAround(center, Math.PI / a.length * (i + 1))));
            return shape;
          });
        }
      }();
  }
}
class SweepModelGenerator extends ModelGenerator {
  constructor(shape, torsionAngle, height) {
    super();
    __publicField(this, "shape");
    __publicField(this, "torsionAngle");
    __privateAdd(this, _height, void 0);
    if (!shape.canExtrude)
      throw new TypeError("Cannot extrude this shape");
    this.shape = shape;
    this.torsionAngle = torsionAngle;
    __privateSet(this, _height, height);
  }
  generate() {
    const shanpe = this.shape.generate();
    const extrudeSettings = {
      depth: __privateGet(this, _height),
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelOffset: 0,
      bevelThickness: 0.01,
      bevelSegments: 2,
      steps: 30,
      curveSegments: 20
    };
    const geometry = new ExtrudeGeometry(shanpe, extrudeSettings);
    const vertices = geometry.attributes.position;
    const quaternion = new Quaternion();
    for (let i = 0; i < vertices.count; i++) {
      let pos = new Vector3();
      pos.fromBufferAttribute(vertices, i);
      const upVec = new Vector3(0, 0, 1);
      quaternion.setFromAxisAngle(
        upVec,
        Math.PI / 180 * this.torsionAngle * (pos.z / __privateGet(this, _height))
      );
      pos = pos.applyQuaternion(quaternion);
      vertices.setXY(i, pos.x, pos.y);
    }
    vertices.needsUpdate = true;
    geometry.rotateX(-Math.PI / 2);
    geometry.scale(0.5, 1, 0.5);
    return geometry;
  }
  get height() {
    return __privateGet(this, _height);
  }
}
_height = new WeakMap();
class RevolveModelGenerator extends ModelGenerator {
  constructor(shape) {
    super();
    __publicField(this, "shape");
    if (!shape.canRevolve)
      throw new TypeError("Cannot revolve this shape");
    this.shape = shape;
  }
  generate() {
    const shanpe = this.shape.generate();
    const points = shanpe.extractPoints(50);
    const geometry = new LatheGeometry(points.shape);
    return geometry;
  }
  get height() {
    return 1;
  }
}
let printOptions = {
  type: "Revolve",
  sweepShape: "B1",
  revolveShape: "A1",
  torsionAngle: 0,
  height: 0.5
};
function setupGui(startPring) {
  const gui = new GUI();
  function setSolidType(value) {
    switch (value) {
      case "Sweep":
        revolveFolder.hide();
        sweepFolder.show();
        break;
      case "Revolve":
        revolveFolder.show();
        sweepFolder.hide();
        break;
    }
  }
  const solidType = gui.add(printOptions, "type", solidTypes).name("Solid Type").onFinishChange(setSolidType);
  const revolveFolder = gui.addFolder("Revolve");
  revolveFolder.add(printOptions, "revolveShape", revolveShapes).name("Shape");
  revolveFolder.open();
  const sweepFolder = gui.addFolder("Sweep");
  sweepFolder.add(printOptions, "sweepShape", sweepShapes).name("Shape");
  sweepFolder.add(printOptions, "torsionAngle", 0, 360, 1).name("Torsion");
  sweepFolder.add(printOptions, "height", 0, 2).name("Height");
  sweepFolder.open();
  gui.add({ button: () => {
    let modelLayerGenerator;
    switch (printOptions.type) {
      case "Sweep":
        modelLayerGenerator = new SweepModelGenerator(generateShape(printOptions.sweepShape), printOptions.torsionAngle, printOptions.height);
        break;
      case "Revolve":
        modelLayerGenerator = new RevolveModelGenerator(generateShape(printOptions.revolveShape));
        break;
    }
    startPring(modelLayerGenerator);
  } }, "button").name("Generate");
  gui.open();
  setSolidType(solidType.getValue());
}
function getObjectSingleMaterial(object) {
  const material2 = object.material;
  if (material2 instanceof Array) {
    throw "Multiple material printing is not supported.";
  }
  return material2;
}
const _Printer = class extends Script {
  constructor() {
    super(...arguments);
    __privateAdd(this, _platform, void 0);
    __privateAdd(this, _head, void 0);
    __privateAdd(this, _headOffset, void 0);
    __publicField(this, "state", { stage: "DONE" });
    __publicField(this, "lastPieceHeight", 1);
  }
  get platform() {
    return __privateGet(this, _platform);
  }
  get head() {
    return __privateGet(this, _head);
  }
  get headOffset() {
    return __privateGet(this, _headOffset);
  }
  get printingObject() {
    return this.object.getObjectByName("printing-object");
  }
  get printedObject() {
    return this.object.getObjectByName("printed-object");
  }
  init() {
    __privateSet(this, _platform, this.object.getObjectByName("printer-platform"));
    __privateSet(this, _head, this.object.getObjectByName("printer-head"));
    __privateSet(this, _headOffset, this.object.getObjectByName("printer-head-offset"));
  }
  removePrintingObject() {
    if (this.printingObject != null) {
      this.printingObject.removeFromParent();
    }
  }
  update(dt) {
    switch (this.state.stage) {
      case "PRINTING":
      case "RESETTING":
        if (this.state.progress < 1) {
          this.state.progress += _Printer.speed * dt;
        } else {
          switch (this.state.stage) {
            case "PRINTING":
              this.finishObject();
              break;
            case "RESETTING":
              this.state = { stage: "DONE" };
              break;
          }
        }
        break;
    }
    if (this.state.stage == "PRINTING") {
      const up2 = new Vector3(0, -1, 0);
      const clippingPlane = new Plane(up2, 0);
      getObjectSingleMaterial(this.printingObject).clippingPlanes[0].copy(clippingPlane).applyMatrix4(this.head.matrixWorld);
    }
    let height = 0;
    switch (this.state.stage) {
      case "RESETTING":
        height += this.lastPieceHeight;
        height += this.state.progress * (1 - this.lastPieceHeight);
        break;
      case "PRINTING":
        height += this.lastPieceHeight * this.state.progress;
        break;
      case "DONE":
        height += 1;
        break;
    }
    this.head.position.y = height;
  }
  finishObject() {
    const printingObject = this.printingObject;
    printingObject.removeFromParent();
    printingObject.name = "printed-object";
    getObjectSingleMaterial(printingObject).clippingPlanes = [];
    this.platform.add(printingObject);
    this.state = { stage: "RESETTING", progress: 0 };
  }
  print(modelGenerator) {
    const printingObject = this.printingObject;
    if (printingObject !== void 0) {
      printingObject.removeFromParent();
    }
    const printedObject = this.printedObject;
    if (printedObject !== void 0) {
      printedObject.removeFromParent();
    }
    let geometry = modelGenerator.build();
    const height = modelGenerator.height * _Printer.printScale;
    this.lastPieceHeight = height;
    this.removePrintingObject();
    const material2 = new MeshStandardMaterial({
      color: 16737792,
      side: DoubleSide,
      clippingPlanes: [new Plane()]
    });
    const obj = new Mesh(geometry, material2);
    this.headOffset.position.y = -height;
    obj.scale.setScalar(_Printer.printScale);
    obj.name = "printing-object";
    this.state = { stage: "PRINTING", progress: 0 };
    this.platform.add(obj);
  }
};
let Printer = _Printer;
_platform = new WeakMap();
_head = new WeakMap();
_headOffset = new WeakMap();
__publicField(Printer, "printScale", 0.3);
__publicField(Printer, "speed", 0.5);
class KeyManager extends Script {
  constructor() {
    super(...arguments);
    __publicField(this, "pressedKeys", /* @__PURE__ */ new Set());
  }
  keydown(key) {
    this.pressedKeys.add(key);
  }
  keyup(key) {
    this.pressedKeys.delete(key);
  }
  isKeyDown(key) {
    return this.pressedKeys.has(key);
  }
}
function zoom(orbit2, delta) {
  let prevZoomSpeed = orbit2.zoomSpeed;
  orbit2.zoomSpeed = delta;
  const event = new WheelEvent("wheel", { deltaY: 0.1 });
  document.querySelector("canvas").dispatchEvent(event);
  orbit2.zoomSpeed = prevZoomSpeed;
}
class OrbitScript extends Script {
  constructor(orbit2, targets, scene2, sm) {
    if (orbit2 instanceof Object3D || targets instanceof ScriptManager || scene2 === void 0 || sm === void 0) {
      throw "Constructor should be called with all parameters.";
    }
    super(scene2, sm);
    __publicField(this, "orbit");
    __publicField(this, "targets");
    __publicField(this, "currentTarget");
    __publicField(this, "keyManager");
    this.orbit = orbit2;
    this.targets = targets;
    this.currentTarget = this.targets[0];
  }
  init() {
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.06;
    this.orbit.enablePan = false;
    this.orbit.autoRotateSpeed = 2;
    this.orbit.maxDistance = 8;
    this.orbit.minDistance = 0.1;
    this.orbit.enabled = false;
    this.keyManager = this.scriptManager.ofType(KeyManager);
  }
  zoom(delta) {
    zoom(this.orbit, delta);
  }
  update(_dt) {
    this.orbit.enabled = this.currentTarget.orbit;
    if (this.currentTarget.orbit) {
      this.currentTarget.object.getWorldPosition(this.orbit.target);
      this.orbit.update();
    } else {
      let camera2 = this.orbit.object;
      this.currentTarget.object.getWorldPosition(camera2.position);
      this.currentTarget.object.getWorldQuaternion(camera2.quaternion);
    }
    if (this.keyManager.isKeyDown("P")) {
      this.zoom(-0.5);
    }
    if (this.keyManager.isKeyDown("O")) {
      this.zoom(0.5);
    }
  }
  setCurrentCamera(index) {
    this.currentTarget = this.targets[index];
  }
  keydown(key) {
    if (key.match(/[1-6]/)) {
      const camNum = parseInt(key);
      this.setCurrentCamera(camNum - 1);
    }
  }
}
class EyeScript extends Script {
  constructor() {
    super(...arguments);
    __publicField(this, "pupil");
    __publicField(this, "position", new Vector2(0, -1));
    __publicField(this, "velocity", new Vector2());
    __publicField(this, "prevGlobalPosition", new Vector3());
  }
  get globalPosition() {
    return this.object.getWorldPosition(new Vector3());
  }
  get normal() {
    return this.object.getWorldDirection(new Vector3(0, 0, -1));
  }
  get right() {
    let vec = new Vector3(1, 0, 0);
    vec.applyQuaternion(this.object.getWorldQuaternion(new Quaternion()));
    return vec;
  }
  init() {
    this.pupil = this.object.getObjectByName("pupil");
    this.prevGlobalPosition = this.globalPosition;
  }
  update(dt) {
    const globalPosition = this.globalPosition;
    const delta = globalPosition.clone().sub(this.prevGlobalPosition);
    const lateral = -delta.dot(this.right);
    const onBorder = this.position.lengthSq() > 0.048 ** 2;
    let constraint = new Vector2(0, 1);
    if (onBorder) {
      const angle = this.position.angle();
      const tangent = new Vector2(0, 1);
      tangent.rotateAround(new Vector2(), angle);
      if (this.velocity.dot(
        new Vector2(-1, 0).rotateAround(new Vector2(), angle)
      ) < 0) {
        this.velocity.copy(
          tangent.clone().multiplyScalar(this.velocity.dot(tangent))
        );
      }
      if (this.position.y > 0) {
        constraint = tangent;
      }
    }
    const gravity = 1;
    const projectedGravity3D = new Vector3(0, gravity, 0).projectOnVector(
      new Vector3(constraint.x, constraint.y, 0)
    );
    const projectedGravity = new Vector2(
      projectedGravity3D.x,
      projectedGravity3D.y
    );
    this.velocity.add(projectedGravity.multiplyScalar(dt));
    const friction = 0.1;
    this.velocity.setLength(this.velocity.length() - friction * dt);
    this.position.add(this.velocity.clone().multiplyScalar(dt));
    this.position.x += lateral;
    this.position.clampLength(0, 0.05);
    this.pupil.position.setX(this.position.x).setZ(this.position.y);
    this.prevGlobalPosition = globalPosition;
  }
}
const up = "Q";
const down = "E";
const grab = ["G", " "];
const speed = 1;
const distanceTreshold = 0.5;
class TrayScript extends Script {
  constructor() {
    super(...arguments);
    __publicField(this, "keyManager");
    __publicField(this, "sceneScript");
    __publicField(this, "holding", null);
    __publicField(this, "height", 0);
  }
  init() {
    this.keyManager = this.scriptManager.ofType(KeyManager);
    this.sceneScript = this.scriptManager.ofType(RoomScript);
  }
  isKeyDown(key) {
    return this.keyManager.isKeyDown(key);
  }
  update(dt) {
    let trayControl = this.isKeyDown(up) ? 1 : this.isKeyDown(down) ? -1 : 0;
    this.height += trayControl * speed * dt;
    this.height = this.height < 0 ? 0 : this.height > 2 ? 2 : this.height;
    this.object.position.y = this.height;
  }
  getShelfCellObjects() {
    return this.sceneScript.getAllObjectByName("shelf-cell");
  }
  getPrintedObjects() {
    return this.sceneScript.getAllObjectByName("printed-object");
  }
  getClosestObjectInRange(objects, maximumDistance) {
    var _a;
    const worldPos = this.object.getWorldPosition(new Vector3());
    let closest = {
      object: void 0,
      distance: void 0
    };
    for (const object of objects) {
      const objectPosition = object.getWorldPosition(new Vector3());
      const distance = worldPos.distanceTo(objectPosition);
      if (distance < maximumDistance && (closest.distance == void 0 || distance < closest.distance)) {
        closest = {
          object,
          distance
        };
      }
    }
    return (_a = closest.object) != null ? _a : null;
  }
  grab(object) {
    object.removeFromParent();
    this.object.add(object);
    this.holding = object;
  }
  drop() {
    const cells = this.getShelfCellObjects().filter((c) => c.children.length == 0);
    const object = this.getClosestObjectInRange(cells, distanceTreshold);
    if (object != null) {
      this.holding.removeFromParent();
      object.add(this.holding);
      this.holding = null;
    }
  }
  grabOrDrop() {
    if (this.holding == null) {
      const object = this.getClosestObjectInRange(this.getPrintedObjects(), distanceTreshold);
      if (object != null) {
        this.grab(object);
      }
    } else {
      this.drop();
    }
  }
  keydown(key) {
    if (grab.includes(key)) {
      this.grabOrDrop();
    }
  }
}
const forward = "W";
const back = "S";
const left = "A";
const right = "D";
const maxSpeed = 3;
const maxTurnSpeed = 0.5;
const acceleration = 13;
const drag = 10;
class ForkliftScript extends Script {
  constructor() {
    super(...arguments);
    __publicField(this, "keyManager");
    __publicField(this, "angle", 0);
    __publicField(this, "position", new Vector3(0, 0, 0));
    __publicField(this, "speed", 0);
    __publicField(this, "steeringPosition", 0);
  }
  get frontRightWheel() {
    return this.object.getObjectByName("front-right");
  }
  get frontLeftWheel() {
    return this.object.getObjectByName("front-left");
  }
  get backRightWheel() {
    return this.object.getObjectByName("back-right");
  }
  get backLeftWheel() {
    return this.object.getObjectByName("back-left");
  }
  get childrenScripts() {
    return {
      tray: TrayScript,
      "left-eye": EyeScript,
      "right-eye": EyeScript
    };
  }
  init() {
    this.keyManager = this.scriptManager.ofType(KeyManager);
  }
  isKeyDown(key) {
    return this.keyManager.isKeyDown(key);
  }
  update(dt) {
    let fwTrust = this.isKeyDown(forward) ? 1 : this.isKeyDown(back) ? -1 : 0;
    let steeringPosition = this.isKeyDown(right) ? 1 : this.isKeyDown(left) ? -1 : 0;
    this.steeringPosition += (steeringPosition - this.steeringPosition) * 0.1;
    this.speed += fwTrust * acceleration * dt;
    if (this.speed != 0) {
      const signBefore = Math.sign(this.speed);
      this.speed -= Math.sign(this.speed) * drag * dt;
      const signAfter = Math.sign(this.speed);
      if (signBefore != signAfter) {
        this.speed = 0;
      }
    }
    if (Math.abs(this.speed) > maxSpeed) {
      this.speed = Math.sign(this.speed) * maxSpeed;
    }
    this.angle += this.speed * this.steeringPosition * maxTurnSpeed * dt;
    let direction = new Vector3(0, 0, -1);
    direction.applyEuler(new Euler(0, -this.angle, 0));
    this.object.position.addScaledVector(direction, this.speed * dt);
    this.object.rotation.set(0, -this.angle, 0);
    this.object.position.clamp(new Vector3(-4, 0, -4), new Vector3(4, 0, 4));
    const steeringMultiplier = 0.3;
    this.frontRightWheel.rotation.y = -this.steeringPosition * steeringMultiplier;
    this.frontLeftWheel.rotation.y = -this.steeringPosition * steeringMultiplier;
    const wheels = [this.frontLeftWheel, this.frontRightWheel, this.backLeftWheel, this.backRightWheel];
    for (const wheel of wheels) {
      wheel.rotateX(this.speed * -0.01);
    }
  }
}
const cellWidth = 0.5;
const cellHeight = 0.5;
const cellRows = 2;
const cellCols = 8;
const legHeight = 0.5;
const topExtraHeight = 0.025;
const thickness = 0.05;
const material = new THREE.MeshStandardMaterial({ color: 26367 });
const pilarMaterial = new THREE.MeshStandardMaterial({ color: 11206400 });
class ShelfScript extends Script {
  addCells() {
    const obj = new Object3D();
    obj.position.setY(legHeight);
    const addBox = (width, height, depth, material2) => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geometry, material2);
      mesh.position.setY(height / 2);
      obj.add(mesh);
      return mesh;
    };
    const pilarPositions = (() => {
      let positions = [];
      for (let col = 0; col <= cellCols; col++) {
        positions.push(new Vector2(col, -0.5));
        positions.push(new Vector2(col, 0.5));
      }
      for (const position of positions) {
        position.x -= cellCols / 2;
        position.multiplyScalar(cellWidth);
      }
      return positions;
    })();
    for (const pos of pilarPositions) {
      addBox(
        thickness,
        cellHeight * cellRows + legHeight + topExtraHeight,
        thickness,
        pilarMaterial
      ).position.setX(pos.x).setZ(pos.y).setY((cellHeight * cellRows - legHeight + topExtraHeight) / 2);
    }
    for (let row = 0; row <= cellRows; row++) {
      const height = row * cellHeight;
      addBox(
        cellWidth * cellCols,
        thickness,
        cellWidth,
        material
      ).position.setY(height - thickness / 2);
    }
    for (let row = 0; row < cellRows; row++) {
      for (let col = 0; col < cellCols; col++) {
        const cell = new Object3D();
        cell.position.setX((col - cellCols / 2 + 0.5) * cellWidth);
        cell.position.setY(row * cellHeight);
        cell.name = "shelf-cell";
        obj.add(cell);
      }
    }
    this.object.add(obj);
  }
  init() {
    this.addCells();
  }
}
class RoomScript extends Script {
  getAllObjectByName(name) {
    let objects = [];
    this.object.traverse((o) => {
      if (o.name == name) {
        objects.push(o);
      }
    });
    return objects;
  }
  get childrenScripts() {
    return {
      forklift: ForkliftScript,
      shelf: ShelfScript,
      printer: Printer
    };
  }
}
class Root extends Script {
  constructor(orbit2, o, sm) {
    super(o, sm);
    __publicField(this, "targets", [
      { objectName: "room-camera", orbit: true },
      { objectName: "printer-camera", orbit: true },
      { objectName: "shelf-camera", orbit: true },
      { objectName: "forklift-camera", orbit: false },
      { objectName: "back-camera", orbit: false },
      { objectName: "side-camera", orbit: false }
    ]);
    __publicField(this, "orbit");
    this.orbit = orbit2;
  }
  get childrenScripts() {
    return {
      scripts: [KeyManager, OrbitScript.bind(null, this.orbit, this.targets.map(({ objectName, orbit: orbit2 }) => ({ object: this.object.getObjectByName(objectName), orbit: orbit2 })))],
      children: {
        room: RoomScript
      }
    };
  }
}
setupGui((generator) => {
  const script = scriptManager.ofType(Printer);
  script == null ? void 0 : script.print(generator);
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1e3
);
camera.position.z = 2;
camera.position.y = 1;
const renderer = new THREE.WebGLRenderer();
renderer.localClippingEnabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbit = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();
let room = new Object3D();
room.name = "room";
room.position.set(0, -0.5, 0);
addRoom(room, 10, 10, 10);
addForklift(room);
addAmbientLight(scene);
addLight(room, -3, 3, -3);
addLight(room, 3, 3, 3);
addPrinter(room);
addShelf(room);
scene.add(room);
addCameras(scene);
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

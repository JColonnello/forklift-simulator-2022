import { Object3D } from "three";
import { Key, Script } from "./script";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ScriptManager } from "./scriptManager";
import { KeyManager } from "./keyManager";

export type CameraTarget = {
  object: Object3D;
  orbit: boolean;
};

function zoom(orbit: OrbitControls, delta: number) {
  let prevZoomSpeed = orbit.zoomSpeed;
  orbit.zoomSpeed = delta;
  const event = new WheelEvent("wheel", { deltaY: 0.1 });
  document.querySelector("canvas")!.dispatchEvent(event);
  orbit.zoomSpeed = prevZoomSpeed;
}

export class OrbitScript extends Script {
  orbit: OrbitControls;
  targets: CameraTarget[];
  currentTarget: CameraTarget;
  keyManager?: KeyManager;

  constructor(scene: Object3D, sm: ScriptManager);
  constructor(
    orbit: OrbitControls,
    targets: CameraTarget[],
    scene: Object3D,
    sm: ScriptManager
  );

  constructor(
    orbit: OrbitControls | Object3D,
    targets: CameraTarget[] | ScriptManager,
    scene?: Object3D,
    sm?: ScriptManager
  ) {
    if (
      orbit instanceof Object3D ||
      targets instanceof ScriptManager ||
      scene === undefined ||
      sm === undefined
    ) {
      throw "Constructor should be called with all parameters.";
    }
    super(scene, sm);
    this.orbit = orbit;
    this.targets = targets;
    this.currentTarget = this.targets[0];
  }

  init(): void {
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.06;

    //this.orbit.enableZoom = false;
    this.orbit.enablePan = false;

    //this.orbit.autoRotate = true;
    this.orbit.autoRotateSpeed = 2;

    this.orbit.maxDistance = 8;
    this.orbit.minDistance = 0.1;

    this.orbit.enabled = false;

    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
  }

  zoom(delta: number) {
    zoom(this.orbit, delta);
  }

  update(_dt: number): void {
    this.orbit.enabled = this.currentTarget.orbit;
    if (this.currentTarget.orbit) {
      this.currentTarget.object.getWorldPosition(this.orbit.target);
      this.orbit.update();
    } else {
      let camera = this.orbit.object;
      this.currentTarget.object.getWorldPosition(camera.position);
      this.currentTarget.object.getWorldQuaternion(camera.quaternion);
    }
    if (this.keyManager!.isKeyDown("P")) {
      this.zoom(-0.5);
    }
    if (this.keyManager!.isKeyDown("O")) {
      this.zoom(0.5);
    }
  }

  setCurrentCamera(index: number) {
    this.currentTarget = this.targets[index];
  }

  keydown(key: Key): void {
    if (key.match(/[1-6]/)) {
      const camNum = parseInt(key);
      this.setCurrentCamera(camNum - 1);
    }
  }
}

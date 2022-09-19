import {Object3D} from "three";
import {Script} from "./script";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ScriptManager} from "./scriptManager";


function* cycle<T>(arr: T[]) {
  while (true) {
    yield *arr;
  }
}

export type CameraTarget = {
  object: Object3D,
  orbit: boolean,
};

export class OrbitScript extends Script {
  orbit: OrbitControls;
  targets: CameraTarget[];
  targetIterator: Generator<CameraTarget>;
  currentTarget: CameraTarget;

  constructor(orbit: OrbitControls, scene: Object3D, targets: CameraTarget[], sm: ScriptManager) {
    super(scene, sm)
    this.orbit = orbit;
    this.targets = targets;
    this.targetIterator = cycle(this.targets);
    this.currentTarget = this.targetIterator.next().value;
  }

  init(): void {
    this.orbit.enableDamping = true;
    this.orbit.dampingFactor = 0.06;

    //this.orbit.enableZoom = false;
    this.orbit.enablePan = false;

    //this.orbit.autoRotate = true;
    this.orbit.autoRotateSpeed = 2;

    this.orbit.maxDistance = 4;
    this.orbit.minDistance = 2;

    this.orbit.enabled = false;
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
  }

  keydown(key: string): void {
    if (key == " ") {
      this.cycleTarget();
    }
  }

  cycleTarget() {
    this.currentTarget = this.targetIterator.next().value;
  }
}

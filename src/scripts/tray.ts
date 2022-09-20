import { Object3D, Vector3 } from "three";
import * as THREE from "three";
import { KeyManager } from "./keyManager";
import { SceneScript } from "./scene";
import { Key, Script } from "./script";

const up: Key = "Q";
const down: Key = "E";
const grab: Key[] = ["G", " "];

const speed = 1;
const distanceTreshold = 1;

const showTreshold = false;

export class TrayScript extends Script {
  keyManager?: KeyManager;
  sceneScript?: SceneScript;
  holding: Object3D | null = null;

  height = 0;

  init(): void {
    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
    this.sceneScript = this.scriptManager.ofType<SceneScript>(SceneScript)!;

    if (showTreshold) {
      const geo = new THREE.SphereGeometry(distanceTreshold);
      const mat = new THREE.MeshStandardMaterial({opacity: 0.2, transparent: true});
      const mesh = new THREE.Mesh(geo, mat);
      this.object.add(mesh);
    }
  }

  isKeyDown(key: Key) {
    return this.keyManager!.isKeyDown(key);
  }

  update(dt: number): void {
    let trayControl = this.isKeyDown(up) ? 1 : this.isKeyDown(down) ? -1 : 0;
    this.height += trayControl * speed * dt;
    this.height = this.height < 0 ? 0 : this.height > 2 ? 2 : this.height;
    this.object.position.y = this.height;
  }

  getShelfCellObjects(): Object3D[] {
    return this.sceneScript!.getAllObjectByName("shelf-cell");
  }

  getPrintedObjects(): Object3D[] {
    return this.sceneScript!.getAllObjectByName("printed-object");
  }

  getClosestObjectInRange(objects: Object3D[], maximumDistance: number): Object3D | null {
    const worldPos = this.object.getWorldPosition(new Vector3());
    let closest: { object?: Object3D; distance?: number } = {
      object: undefined,
      distance: undefined,
    };
    for (const object of objects) {
      const objectPosition = object.getWorldPosition(new Vector3());
      const distance = worldPos.distanceTo(objectPosition);
      if (
        distance < maximumDistance &&
        (closest.distance == undefined || distance < closest.distance)
      ) {
        closest = {
          object,
          distance,
        };
      }
    }
    return closest.object ?? null;
  }

  grab(object: Object3D) {
    object.removeFromParent();
    this.object.add(object);
    this.holding = object;
  }

  drop() {
    const cells = this.getShelfCellObjects().filter(c => c.children.length == 0);
    const object = this.getClosestObjectInRange(cells, distanceTreshold);
    if (object != null) {
      this.holding!.removeFromParent();
      object.add(this.holding!);
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

  keydown(key: Key): void {
    if (grab.includes(key)) {
      this.grabOrDrop();
    }
  }
}

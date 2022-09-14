import { Vector2, Vector3 } from "three";
import { KeyManager } from "./keyManager";
import { Key, Script } from "./script";

const forward: Key = "W";
const back: Key = "S";
const left: Key = "A";
const right: Key = "D";

const up: Key = "Q";
const down: Key = "E";
const grab: Key = "G";

const maxSpeed = 5;
const maxTurnSpeed = 4;

export class ForkliftScript extends Script {
  keyManager?: KeyManager;

  direction = new Vector2(1, 0);
  position = new Vector3(0, 0, 0);

  init(): void {
    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
  }

  isKeyDown(key: Key) {
    return this.keyManager!.isKeyDown(key);
  }

  update(dt: number): void {
    let fwSpeed = this.isKeyDown(forward) ? 1 : this.isKeyDown(back) ? -1 : 0;

    let turnSpeed = this.isKeyDown(right) ? 1 : this.isKeyDown(left) ? -1 : 0;

    this.object.position.addScaledVector(new Vector3(this.direction.y, 0, -this.direction.x), fwSpeed * maxSpeed * dt);
    this.direction.rotateAround(new Vector2(), turnSpeed * maxTurnSpeed * dt);
    this.object.rotation.set(0, -this.direction.angle(), 0)

    this.object.position.clamp(new Vector3(-5, 0, -5), new Vector3(5, 0, 5))
  }
}

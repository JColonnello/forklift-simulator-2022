import { Euler, Vector2, Vector3 } from "three";
import { KeyManager } from "./keyManager";
import { Key, Script } from "./script";

const forward: Key = "W";
const back: Key = "S";
const left: Key = "A";
const right: Key = "D";

const up: Key = "Q";
const down: Key = "E";
const grab: Key = "G";

const minSpeed = 0.01;
const maxSpeed = 3;
const maxTurnSpeed = 0.5;
const acceleration = 13;
const drag = 10;

export class ForkliftScript extends Script {
  keyManager?: KeyManager;

  angle = 0;
  position = new Vector3(0, 0, 0);
  speed = 0;
  steeringPosition = 0;

  init(): void {
    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
  }

  isKeyDown(key: Key) {
    return this.keyManager!.isKeyDown(key);
  }

  update(dt: number): void {
    let fwTrust = this.isKeyDown(forward) ? 1 : this.isKeyDown(back) ? -1 : 0;

    let steeringPosition = this.isKeyDown(right) ? 1 : this.isKeyDown(left) ? -1 : 0;
    this.steeringPosition += (steeringPosition - this.steeringPosition) * 0.1;

    this.speed += fwTrust * acceleration * dt;
    if (Math.abs(this.speed) > minSpeed) {
      this.speed -= Math.sign(this.speed) * drag * dt;
    } else {
      this.speed = 0;
    }
    if (Math.abs(this.speed) > maxSpeed) {
      this.speed = Math.sign(this.speed) * maxSpeed;
    }

    this.angle += this.speed * this.steeringPosition * maxTurnSpeed * dt;

    let direction = new Vector3(0, 0, -1);
    direction.applyEuler(new Euler(0, -this.angle, 0))
    this.object.position.addScaledVector(direction, this.speed * dt);
    this.object.rotation.set(0, -this.angle, 0)

    this.object.position.clamp(new Vector3(-5, 0, -5), new Vector3(5, 0, 5))
  }
}

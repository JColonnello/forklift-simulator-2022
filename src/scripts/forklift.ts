import { Euler, Object3D, Vector3 } from "three";
import { EyeScript } from "./eye";
import { KeyManager } from "./keyManager";
import { Key, Script } from "./script";
import { TrayScript } from "./tray";

const forward: Key = "W";
const back: Key = "S";
const left: Key = "A";
const right: Key = "D";

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

  public get frontRightWheel(): Object3D {
    return this.object.getObjectByName("front-right")!;
  }

  public get frontLeftWheel(): Object3D {
    return this.object.getObjectByName("front-left")!;
  }

  public get backRightWheel(): Object3D {
    return this.object.getObjectByName("back-right")!;
  }

  public get backLeftWheel(): Object3D {
    return this.object.getObjectByName("back-left")!;
  }

  get childrenScripts() {
    return {
      tray: TrayScript,
      "left-eye": EyeScript,
      "right-eye": EyeScript,
    };
  }

  init(): void {
    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
  }

  isKeyDown(key: Key) {
    return this.keyManager!.isKeyDown(key);
  }

  update(dt: number): void {
    let fwTrust = this.isKeyDown(forward) ? 1 : this.isKeyDown(back) ? -1 : 0;

    let steeringPosition = this.isKeyDown(right)
      ? 1
      : this.isKeyDown(left)
      ? -1
      : 0;
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
    this.frontRightWheel.rotation.y =
      -this.steeringPosition * steeringMultiplier;
    this.frontLeftWheel.rotation.y =
      -this.steeringPosition * steeringMultiplier;

    const wheels = [
      this.frontLeftWheel,
      this.frontRightWheel,
      this.backLeftWheel,
      this.backRightWheel,
    ];
    for (const wheel of wheels) {
      wheel.rotateX(this.speed * -0.01);
    }
  }
}

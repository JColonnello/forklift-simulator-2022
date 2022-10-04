import { Object3D, Quaternion, Vector2, Vector3 } from "three";
import { Script } from "./script";

export class EyeScript extends Script {
  pupil?: Object3D;
  position = new Vector2(0, -1);
  velocity = new Vector2();
  prevGlobalPosition = new Vector3();

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

  init(): void {
    this.pupil = this.object.getObjectByName("pupil");
    this.prevGlobalPosition = this.globalPosition;
  }

  update(dt: number): void {
    const globalPosition = this.globalPosition;
    const delta = globalPosition.clone().sub(this.prevGlobalPosition);

    // Calculate lateral eye movement by projecting delta onto lateral axis.
    const lateral = -delta.dot(this.right);

    const onBorder = this.position.lengthSq() > 0.048 ** 2;

    let constraint = new Vector2(0, 1);
    if (onBorder) {
      const angle = this.position.angle();
      const tangent = new Vector2(0, 1);
      tangent.rotateAround(new Vector2(), angle);
      // Stop normal speed when colliding with borders
      if (
        this.velocity.dot(
          new Vector2(-1, 0).rotateAround(new Vector2(), angle)
        ) < 0
      ) {
        this.velocity.copy(
          tangent.clone().multiplyScalar(this.velocity.dot(tangent))
        );
      }

      if (this.position.y > 0) {
        constraint = tangent;
      }
    }

    // Apply gravity
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

    this.pupil!.position.setX(this.position.x).setZ(this.position.y);

    this.prevGlobalPosition = globalPosition;
  }
}

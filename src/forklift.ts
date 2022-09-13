import { KeyManager } from "./keyManager";
import { Key, Script } from "./object";

export class ForkliftScript extends Script {
  keyManager?: KeyManager;

  init(): void {
    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
  }

  update(dt: number): void {
    if (this.keyManager!.isKeyDown('W')) {
      this.object.rotation.x += dt;
      this.object.rotation.y += dt;
    }
  }
}



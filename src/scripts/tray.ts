import { KeyManager } from "./keyManager";
import { Key, Script } from "./script";

const up: Key = "Q";
const down: Key = "E";
//const grab: Key = "G";

const speed = 1;

export class TrayScript extends Script {
  keyManager?: KeyManager;

  height = 0;


  init(): void {
    this.keyManager = this.scriptManager.ofType<KeyManager>(KeyManager)!;
  }

  isKeyDown(key: Key) {
    return this.keyManager!.isKeyDown(key);
  }

  update(dt: number): void {
    let trayControl = this.isKeyDown(up) ? 1 : this.isKeyDown(down) ? -1 : 0;
    this.height += trayControl * speed * dt;
    this.height = this.height < 0 ? 0 : this.height > 1 ? 1 : this.height;
    this.object.position.y = this.height;
  }
}

import {Key, Script} from "./script";

export class KeyManager extends Script {
  pressedKeys: Set<Key> = new Set();

  keydown(key: Key) {
    this.pressedKeys.add(key);
  }

  keyup(key: Key) {
    this.pressedKeys.delete(key);
  }

  isKeyDown(key: Key) {
    return this.pressedKeys.has(key);
  }
}


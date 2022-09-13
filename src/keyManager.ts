import {Key, Script} from "./object";

export class KeyManager extends Script {
  pressedKeys: Key[] = [];

  keydown(key: Key) {
    this.pressedKeys.push(key);
  }

  keyup(key: Key) {
    let keyIndex = this.pressedKeys.indexOf(key);
    if (keyIndex > -1) {
      this.pressedKeys.splice(keyIndex);
    }
  }

  isKeyDown(key: Key) {
    return this.pressedKeys.includes(key);
  }
}


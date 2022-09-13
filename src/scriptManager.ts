import { Key, Script } from "./object";

export class ScriptManager {
  scripts: Script[] = [];

  addScript(script: Script) {
    this.scripts.push(script);
  }

  removeScript(script: Script) {
    let i = this.scripts.indexOf(script);
    this.scripts.splice(i);
  }

  #dispatch(event: keyof Script, args: any[] = []) {
    for (let script of this.scripts) {
      script[event](...args);
    }
  }

  dispatchUpdate(dt: number) {
    this.#dispatch("update", [dt]);
  }

  dispatchPointerDown(x: number, y: number) {
    this.#dispatch("pointerdown", [x, y]);
  }

  dispatchPointerUp(x: number, y: number) {
    this.#dispatch("pointerup", [x, y]);
  }

  dispatchPointerMove(x: number, y: number) {
    this.#dispatch("pointermove", [x, y]);
  }

  dispatchKeyDown(key: Key) {
    this.#dispatch("keydown", [key]);
  }

  dispatchKeyUp(key: Key) {
    this.#dispatch("keyup", [key]);
  }

  dispatchInit() {
    this.#dispatch("init");
  }
}

import { Key, Script } from "./object";

export class ScriptManager {
  scripts: Script[] = [];

  addScript(scriptBuilder: (scriptManager: ScriptManager) => Script) {
    this.scripts.push(scriptBuilder(this));
  }

  removeScript(script: Script) {
    let i = this.scripts.indexOf(script);
    this.scripts.splice(i);
  }

  removeScriptOfType(scriptType: typeof Script) {
    let script = this.ofType(scriptType);
    if (script == null)
      return;
    this.removeScript(script);
  }

  ofType<T extends Script>(scriptType: typeof Script) {
    for (let script of this.scripts) {
      if (script instanceof scriptType) {
        return script as T;
      }
    }
    return null;
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

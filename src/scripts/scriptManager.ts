import { Key, keys, Script } from "./script";

export class ScriptManager {
  scripts: Script[] = [];

  addScript(scriptBuilder: new (scriptManager: ScriptManager) => Script) {
    const script = new scriptBuilder(this);
    this.scripts.push(script);
    return script;
  }

  removeScript(script: Script) {
    let i = this.scripts.indexOf(script);
    this.scripts.splice(i);
  }

  removeScriptOfType(scriptType: typeof Script) {
    let script = this.ofType(scriptType);
    if (script == null) return;
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

  setupEventListeners() {
    document.addEventListener("pointerup", ({ x, y }) =>
      this.dispatchPointerUp(x, y)
    );
    document.addEventListener("pointerdown", ({ x, y }) =>
      this.dispatchPointerDown(x, y)
    );
    document.addEventListener("pointermove", ({ x, y }) =>
      this.dispatchPointerMove(x, y)
    );

    function isKey(str: string): str is Key {
      return keys.includes(str as Key);
    }

    function convertKeyEvent(keyEvent: KeyboardEvent) {
      let key = keyEvent.key;
      if (keyEvent.key.length == 1) {
        key = key.toUpperCase();
      }

      if (isKey(key)) {
        return key;
      }

      throw new Error(`Could not convert key ${keyEvent.key}.`);
    }

    document.addEventListener("keyup", (event) => {
      this.dispatchKeyUp(convertKeyEvent(event));
    });
    document.addEventListener("keydown", (event) => {
      this.dispatchKeyDown(convertKeyEvent(event));
    });
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

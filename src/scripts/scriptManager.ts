import {Object3D} from "three";
import { Key, keys, Script } from "./script";

type ScriptConstructor = new (o: Object3D, sm: ScriptManager) => Script;

export type ChildrenScriptMap = {
  [objName: string | "this"]: ScriptMap
};

type ScriptConstructors = ScriptConstructor[] | ScriptConstructor;

type ScriptMapWithChildren = {
  scripts?: ScriptConstructors,
  children: ChildrenScriptMap,
};

export type ScriptMap = ScriptConstructors | ScriptMapWithChildren | ChildrenScriptMap;

function isScriptMapWithChildren(sm: ScriptMap): sm is ScriptMapWithChildren {
  return !(sm instanceof Function) && !(sm instanceof Array) && sm.scripts !== undefined;
}

type NormalizedScriptMap = {
  scripts: ScriptConstructor[],
  children: ChildrenScriptMap,
};

function normalize(sm: ScriptMap): NormalizedScriptMap {
  if (sm instanceof Function) {
    return {scripts: [sm], children: {}};
  }
  if (sm instanceof Array) {
    return {scripts: sm, children: {}};
  }
  if (isScriptMapWithChildren(sm)) {
    let scripts = sm.scripts ?? [];
    return {scripts: scripts instanceof Array ? scripts : [scripts], children: sm.children};
  }
  return {scripts: [], children: sm};
}

export class ScriptManager {
  scripts: Script[] = [];

  addScript(scriptBuilder: ScriptConstructor, object: Object3D) {
    const script = new scriptBuilder(object, this);
    this.scripts.push(script);
    
    this.addAll(script.childrenScripts, object);
    return script;
  }

  addAll(scriptMap: ScriptMap, root: Object3D) {
    const {scripts, children} = normalize(scriptMap);

    for (const script of scripts) {
      this.addScript(script, root);
    }
    for (const child in children) {
      const element = children[child];
      this.addAll(element, root.getObjectByName(child)!);
    }
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

  dispatchUpdate(dt: number) {
    this.scripts.forEach(s => s.update(dt));
  }

  dispatchPointerDown(x: number, y: number) {
    this.scripts.forEach(s => s.pointerdown(x, y));
  }

  dispatchPointerUp(x: number, y: number) {
    this.scripts.forEach(s => s.pointerup(x, y));
  }

  dispatchPointerMove(x: number, y: number) {
    this.scripts.forEach(s => s.pointermove(x, y));
  }

  dispatchKeyDown(key: Key) {
    this.scripts.forEach(s => s.keydown(key));
  }

  dispatchKeyUp(key: Key) {
    this.scripts.forEach(s => s.keyup(key));
  }

  dispatchInit() {
    this.scripts.forEach(s => s.init());
  }
}

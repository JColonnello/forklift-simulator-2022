import { Object3D } from "three";
import {ScriptManager} from "./scriptManager";

export const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  " ",
  ..."[{}];:\"'\\|/?.>,<~!@#$%^&*()_+",
  ..."`1234567890-=",
  "ArrowDown",
  "Tab",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "Alt",
  "Control",
  "Shift",
  "Enter",
  "Backspace",
  "OS",
  "Escape",
] as const;
export type Key = typeof keys[number];

export abstract class Script {
  object: Object3D;
  scriptManager: ScriptManager;

  constructor(object: Object3D, scriptManager: ScriptManager) {
    this.object = object;
    this.scriptManager = scriptManager;
  }

  update(_dt: number): void {}
  init(): void {}

  keydown(_key: Key): void {}
  keyup(_key: Key): void {}
  pointerdown(_x: number, _y: number): void {}
  pointerup(_x: number, _y: number): void {}
  pointermove(_x: number, _y: number): void {}
}

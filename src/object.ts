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

  update(dt: number): void {}
  init(): void {}
  start(): void {}
  stop(): void {}

  keydown(key: Key): void {}
  keyup(key: Key): void {}
  pointerdown(x: number, y: number): void {}
  pointerup(x: number, y: number): void {}
  pointermove(x: number, y: number): void {}
}

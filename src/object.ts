import { Object3D } from "three";

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
] as const;
export type Key = typeof keys[number];

export abstract class Script {
  object: Object3D;

  constructor(object: Object3D) {
    this.object = object;
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

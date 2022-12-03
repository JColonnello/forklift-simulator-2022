import { Object3D } from "three";
import { ForkliftScript } from "./forklift";
import { Printer } from "./printer";
import { Script } from "./script";
import { ShelfScript } from "./shelf";

export class RoomScript extends Script {
  getAllObjectByName(name: string): Object3D[] {
    let objects: Object3D[] = [];
    this.object.traverse((o) => {
      if (o.name == name) {
        objects.push(o);
      }
    });
    return objects;
  }

  get childrenScripts() {
    return {
      forklift: ForkliftScript,
      shelf: ShelfScript,
      printer: Printer,
    };
  }
}

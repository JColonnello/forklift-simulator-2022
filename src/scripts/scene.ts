import {Object3D} from "three";
import { Script } from "./script";

export class SceneScript extends Script {
  getAllObjectByName(name: string): Object3D[] {
    let objects: Object3D[] = [];
    this.object.traverse(o => {
      if (o.name == name) {
        objects.push(o);
      }
    });
    return objects;
  }
}

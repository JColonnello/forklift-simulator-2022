import { Key, Script } from "./object";

export class ForkliftScript extends Script {
  update(dt: number): void {
    console.log("Hola");
    //this.object.rotation.x += dt;
    //this.object.rotation.y += dt;
  }

  keydown(key: Key): void {
  	console.log(key);
  }
}

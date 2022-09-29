import {Object3D} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {KeyManager} from "./keyManager";
import {OrbitScript} from "./orbit";
import {RoomScript} from "./scene";
import { Script } from "./script";
import {ScriptManager} from "./scriptManager";


export class Root extends Script {
  targets = [
    { objectName: "room-camera", orbit: true },
    { objectName: "printer-camera", orbit: true },
    { objectName: "shelf-camera", orbit: true },
    { objectName: "forklift-camera", orbit: false },
    { objectName: "back-camera", orbit: false },
    { objectName: "side-camera", orbit: false },
  ];
  orbit: OrbitControls;

  constructor(orbit: OrbitControls, o: Object3D, sm: ScriptManager) {
    super(o, sm);
    this.orbit = orbit;
  }

  get childrenScripts() {
    return {
      scripts: [KeyManager, OrbitScript.bind(null, this.orbit, this.targets.map(({objectName, orbit}) => ({object: this.object.getObjectByName(objectName)!, orbit})))],
      children: {
        room: RoomScript
      }
    };
  }
}

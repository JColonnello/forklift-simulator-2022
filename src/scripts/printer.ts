import {
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Object3D,
  Plane,
  RepeatWrapping,
  Vector2,
  Vector3,
} from "three";
//import { MeshNormalMaterial } from "three";
//import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { ModelGenerator } from "../generator";
import { loadTexture } from "../textures";
import { Script } from "./script";

enum PrintingStage {
  PRINTING = "PRINTING",
  RESETTING = "RESETTING",
  DONE = "DONE",
}

type PrinterState =
  | {
      stage: PrintingStage.DONE;
    }
  | {
      stage: PrintingStage.PRINTING;
      progress: number;
    }
  | {
      stage: PrintingStage.RESETTING;
      progress: number;
    };

function getObjectSingleMaterial(object: Mesh) {
  const material = object.material;
  if (material instanceof Array) {
    throw "Multiple material printing is not supported.";
  }
  return material;
}

export class Printer extends Script {
  #platform?: Object3D;
  #head?: Mesh;
  #headOffset?: Object3D;
  static printScale = 0.3;
  static speed = 0.5;
  state: PrinterState = { stage: PrintingStage.DONE };
  lastPieceHeight: number = 1;

  get platform(): Object3D {
    return this.#platform!;
  }

  get head(): Mesh {
    return this.#head!;
  }

  get headOffset(): Object3D {
    return this.#headOffset!;
  }

  get printingObject(): Mesh {
    return this.object.getObjectByName("printing-object") as Mesh;
  }

  get printedObject(): Mesh {
    return this.object.getObjectByName("printed-object") as Mesh;
  }

  init(): void {
    this.#platform = this.object.getObjectByName("printer-platform");
    this.#head = this.object.getObjectByName("printer-head") as Mesh;
    this.#headOffset = this.object.getObjectByName("printer-head-offset");
  }

  removePrintingObject() {
    if (this.printingObject != null) {
      this.printingObject.removeFromParent();
    }
  }

  update(dt: number): void {
    switch (this.state.stage) {
      case PrintingStage.PRINTING:
      case PrintingStage.RESETTING:
        if (this.state.progress < 1) {
          this.state.progress += Printer.speed * dt;
        } else {
          switch (this.state.stage) {
            case PrintingStage.PRINTING:
              this.finishObject();
              break;
            case PrintingStage.RESETTING:
              this.state = { stage: PrintingStage.DONE };
              break;
          }
        }
        break;
    }

    if (this.state.stage == PrintingStage.PRINTING) {
      const up = new Vector3(0, -1, 0);
      const clippingPlane = new Plane(up, 0);
      getObjectSingleMaterial(this.printingObject)
        .clippingPlanes[0].copy(clippingPlane)
        .applyMatrix4(this.head.matrixWorld);
    }

    let height = 0;
    switch (this.state.stage) {
      case PrintingStage.RESETTING:
        height += this.lastPieceHeight;
        height += this.state.progress * (1 - this.lastPieceHeight);
        break;
      case PrintingStage.PRINTING:
        height += this.lastPieceHeight * this.state.progress;
        break;
      case PrintingStage.DONE:
        height += 1;
        break;
    }

    this.head.position.y = height;
  }

  finishObject() {
    const printingObject: Mesh = this.printingObject!;
    printingObject.removeFromParent();
    printingObject.name = "printed-object";
    getObjectSingleMaterial(printingObject).clippingPlanes = [];
    this.platform.add(printingObject);
    this.state = { stage: PrintingStage.RESETTING, progress: 0 };
  }

  print(modelGenerator: ModelGenerator) {
    const printingObject = this.printingObject;
    if (printingObject !== undefined) {
      printingObject.removeFromParent();
    }
    const printedObject = this.printedObject;
    if (printedObject !== undefined) {
      printedObject.removeFromParent();
    }
    let geometry = modelGenerator.build();
    const height = modelGenerator.height * Printer.printScale;
    this.lastPieceHeight = height;

    this.removePrintingObject();
    const texture = loadTexture("Pattern05_1K_VarB.png");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(4, 4);
    const material = new MeshPhongMaterial({
      //color: 0xff6600,
      map: texture,
      side: DoubleSide,
      clippingPlanes: [new Plane()],
      //wireframe: true,
      //flatShading: true,
    });
    //const material = new MeshNormalMaterial({
    //side: DoubleSide,
    //clippingPlanes: [new Plane()],
    //});
    const obj = new Mesh(geometry, material);

    this.headOffset.position.y = -height;
    obj.scale.setScalar(Printer.printScale);
    obj.name = "printing-object";
    this.state = { stage: PrintingStage.PRINTING, progress: 0 };
    // obj.name = 'printed-object';
    this.platform.add(obj);
  }
}

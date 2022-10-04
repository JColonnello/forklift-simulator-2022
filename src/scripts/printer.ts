import { BufferGeometry, DoubleSide, Mesh, MeshStandardMaterial, Object3D } from "three";
import { ModelGenerator } from "../generator";
import { Script } from "./script";

enum PrintingStage {
  PRINTING = 'PRINTING',
  RESETTING = 'RESETTING',
  DONE = 'DONE',
}

type PrinterState = {
  stage: PrintingStage.DONE
} | {
  stage: PrintingStage.PRINTING,
  progress: number
} | {
  stage: PrintingStage.RESETTING,
  progress: number
};


export class Printer extends Script {
  #platform?: Object3D;
  #head?: Object3D;
  #headOffset?: Object3D;
  static printScale = 0.3;
  static speed = 0.5;
  state: PrinterState = {stage: PrintingStage.DONE};
  lastPieceHeight: number = 1;

  get platform(): Object3D {
    return this.#platform!;
  }

  get head(): Object3D {
    return this.#head!;
  }

  get headOffset(): Object3D {
    return this.#headOffset!;
  }

  get printingObject() {
    return this.object.getObjectByName('printing-object');
  }

  get printedObject() {
    return this.object.getObjectByName('printed-object');
  }

  init(): void {
    this.#platform = this.object.getObjectByName('printer-platform');
    this.#head = this.object.getObjectByName('printer-head');
    this.#headOffset = this.object.getObjectByName('printer-head-offset');
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
              this.state = {stage: PrintingStage.DONE};
              break;
          }
        }
        break;
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
    const printingObject = this.printingObject!;
    printingObject.removeFromParent();
    printingObject.name = 'printed-object';
    this.platform.add(printingObject);
    this.state = {stage: PrintingStage.RESETTING, progress: 0};
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
    const geometry = modelGenerator.build();
    const height = modelGenerator.height * Printer.printScale;
    this.lastPieceHeight = height;
    // Fix lighting issue
    geometry.computeVertexNormals();

    this.removePrintingObject();
    const material = new MeshStandardMaterial({color: 0xFF6600, side: DoubleSide});
    const obj = new Mesh(geometry, material);
    this.headOffset.position.y = -height;
    obj.scale.setScalar(Printer.printScale);
    obj.name = 'printing-object';
    this.state = {stage: PrintingStage.PRINTING, progress: 0};
    // obj.name = 'printed-object';
    this.headOffset.add(obj);
  }
}

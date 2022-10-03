import { BufferGeometry, Mesh, MeshStandardMaterial, Object3D } from "three";
import { Script } from "./script";


export class Printer extends Script {
  platform?: Object3D;
  static printScale = 0.3;

  get printingObject() {
    return this.platform!.children.at(0);
  }

  init(): void {
    this.platform = this.object.getObjectByName('printer-platform');
  }

  removePrintingObject() {
    if (this.printingObject != null) {
      this.printingObject.removeFromParent();
    }
  }

  print(geometry: BufferGeometry) {
    // Fix lighting issue
    geometry.computeVertexNormals();

    this.removePrintingObject();
    const material = new MeshStandardMaterial({color: 0xFF6600});
    const obj = new Mesh(geometry, material);
    obj.scale.setScalar(Printer.printScale);
    obj.name = 'printing-object';
    obj.name = 'printed-object';
    this.platform!.add(obj);
  }
}

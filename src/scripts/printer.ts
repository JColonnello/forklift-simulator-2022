import { BufferGeometry, Mesh, MeshStandardMaterial, Object3D } from "three";
import { Script } from "./script";


export class Printer extends Script {
  platform?: Object3D;
  printingObject: Object3D | null = null;

  init(): void {
    this.platform = this.object.getObjectByName('printer-platform');
  }

  removePrintingObject() {
    if (this.printingObject != null) {
      this.printingObject.removeFromParent();
      this.printingObject = null;
    }
  }

  print(geometry: BufferGeometry) {
    // Fix lighting issue
    geometry.computeVertexNormals();

    this.removePrintingObject();
    const material = new MeshStandardMaterial({color: 0xFF6600});
    this.printingObject = new Mesh(geometry, material);
    this.printingObject.name = 'printing-object';
    this.platform!.add(this.printingObject);
  }
}

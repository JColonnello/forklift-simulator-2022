import * as THREE from "three";
import { Object3D, Vector2 } from "three";
import { Script } from "./script";

const cellWidth = 0.5;
const cellHeight = 0.5;
const cellRows = 2;
const cellCols = 8;
const legHeight = 0.5;
const topExtraHeight = 0.025;
const thickness = 0.05;
const material = new THREE.MeshStandardMaterial({ color: 0x0066ff });
const pilarMaterial = new THREE.MeshStandardMaterial({ color: 0xaaff00 });

export class ShelfScript extends Script {
  addCells() {
    const obj = new Object3D();
    obj.position.setY(legHeight);
    const addBox = (
      width: number,
      height: number,
      depth: number,
      material: THREE.Material
    ) => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.setY(height / 2);
      obj.add(mesh);
      return mesh;
    };

    const pilarPositions = (() => {
      let positions = [];
      for (let col = 0; col <= cellCols; col++) {
        positions.push(new Vector2(col, -0.5));
        positions.push(new Vector2(col, 0.5));
      }
      for (const position of positions) {
        position.x -= cellCols / 2;
        position.multiplyScalar(cellWidth);
      }
      return positions;
    })();

    for (const pos of pilarPositions) {
      addBox(
        thickness,
        cellHeight * cellRows + legHeight + topExtraHeight,
        thickness,
        pilarMaterial
      )
        .position.setX(pos.x)
        .setZ(pos.y)
        .setY((cellHeight * cellRows - legHeight + topExtraHeight) / 2);
    }

    for (let row = 0; row <= cellRows; row++) {
      const height = row * cellHeight;
      addBox(
        cellWidth * cellCols,
        thickness,
        cellWidth,
        material
      ).position.setY(height - thickness / 2);
    }

    for (let row = 0; row < cellRows; row++) {
      for (let col = 0; col < cellCols; col++) {
        const cell = new Object3D();
        cell.position.setX((col - cellCols / 2 + 0.5) * cellWidth);
        cell.position.setY(row * cellHeight);
        cell.name = "shelf-cell";
        obj.add(cell);
      }
    }

    this.object.add(obj);
  }

  init(): void {
    this.addCells();
  }
}

import { BufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, LatheGeometry, Quaternion, Shape, Vector2, Vector3 } from "three";
import {mergeVertices} from "./vertexUtils";

export const solidTypes = ["Sweep", "Revolve"] as const;
export type SolidType = typeof solidTypes[number];

export const sweepShapes = ["B1", "B2", "B3", "B4"] as const;
export type SweepShape = typeof sweepShapes[number];

export const revolveShapes = ["A1", "A2", "A3", "A4"] as const;
export type RevolveShape = typeof revolveShapes[number];

export abstract class ModelGenerator {
  build(): BufferGeometry {
    var geometry = this.generate();
    // Fix lighting issue
    geometry = mergeVertices(geometry);
    geometry.computeVertexNormals();

    return geometry;
  }
  abstract get height(): number;
  protected abstract generate(): BufferGeometry;
}


export interface BaseShape {
  get canExtrude(): boolean;
  get canRevolve(): boolean;
  generate(): Shape;
}

function mirrorVertices(vertices: Vector2[], axis: Vector2): Vector2[] {
  return [...vertices, ...vertices.slice(0, -1).map(v => new Vector3(v.x, v.y).reflect(new Vector3(axis.x, axis.y).normalize())).map(v => new Vector2(v.x, v.y)).reverse()]
}

class ShapeWithSubdividedLines extends Shape {
  lineTo(x: number, y: number): this {
    this.splineThru([new Vector2(x, y)]);
    return this;
  }
}

export function generateShape(shapeType: SweepShape | RevolveShape): BaseShape {
  switch (shapeType) {
    case 'A1':
      return new class implements BaseShape {
        canExtrude = false;
        canRevolve = true;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(0, 0);
          shape.lineTo(-4/12, 0);
          shape.lineTo(-4/12, 2/12);
          shape.splineThru([new Vector2(-1/12, 3/12), new Vector2(-3/12, 6/12), new Vector2(-1/12, 6/12 + 6/12 - 3/12)]);
          shape.lineTo(-4/12, 1 - 2/12);
          shape.lineTo(-4/12, 1);
          shape.lineTo(0, 1);
          return shape as Shape;
        }
      };

    case 'A2':
      return new class implements BaseShape {
        canExtrude = false;
        canRevolve = true;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(0, 0);
          shape.splineThru([new Vector2(-30/175, 1/175), new Vector2(-52/175, 24/175), new Vector2(-32/175, 88/175)]);
          shape.lineTo(-32/175, 103/175);
          shape.splineThru([new Vector2(-39/175, 120/175), new Vector2(-50/175, 138/175), new Vector2(-55/175, 148/175)]);
          shape.lineTo(-55/175, 155/175);
          shape.splineThru([new Vector2(-50/175, 159/175), new Vector2(-40/175, 165/175), new Vector2(-38/175, 175/175)]);
          return shape as Shape;
        }
      };

    case 'A3':
      return new class implements BaseShape {
        canExtrude = false;
        canRevolve = true;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(0, 0);
          shape.lineTo(-91/179, 0);
          shape.lineTo(-23/179, 32/179);
          shape.lineTo(-23/179, 48/179);
          shape.splineThru([new Vector2(-45/179, 57/179), new Vector2(-65/179, 70/179), new Vector2(-73/179, 87/179)]);
          shape.splineThru([new Vector2(-73/179, 122/179), new Vector2(-72/179, 133/179), new Vector2(-72/179, 143/179)]);
          shape.splineThru([new Vector2(-61/179, 158/179), new Vector2(-42/179, 162/179), new Vector2(-32/179, 179/179)]);
          return shape as Shape;
        }
      };

    case 'A4':
      return new class implements BaseShape {
        canExtrude = false;
        canRevolve = true;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(0, 0);
          shape.lineTo(-40/180, 0);
          shape.splineThru([new Vector2(-53/180, 4/180), new Vector2(-61/180, 14/180), new Vector2(-63/180, 28/180)]);
          shape.splineThru([new Vector2(-54/180, 39/180), new Vector2(-33/180, 44/180), new Vector2(-24/180, 55/180)]);
          shape.splineThru([new Vector2(-26/180, 75/180), new Vector2(-49/180, 93/180), new Vector2(-95/180, 102/180)]);
          shape.splineThru([new Vector2(-69/180, 107/180), new Vector2(-48/180, 120/180), new Vector2(-43/180, 145/180)]);
          shape.splineThru([new Vector2(-35/180, 163/180), new Vector2(-20/180, 176/180), new Vector2(-3/180, 180/180)]);
          return shape as Shape;
        }
      };

    case 'B1':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = false;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(Math.cos(Math.PI/3), Math.sin(Math.PI/3));
          shape.lineTo(Math.cos(Math.PI), Math.sin(Math.PI));
          shape.lineTo(Math.cos(-Math.PI/3), Math.sin(-Math.PI/3));
          shape.lineTo(Math.cos(Math.PI/3), Math.sin(Math.PI/3));
          return shape as Shape;
        }
      };

    case 'B2':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = false;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          let ang = 0;
          shape.moveTo(Math.cos(ang), Math.sin(ang));
          for(let i = 1; i < 7*2;)
          {
            ang = Math.PI / 7 * i++;
            const p1 = new Vector2(Math.cos(ang), Math.sin(ang)).multiplyScalar(0.6);
            ang = Math.PI / 7 * i++;
            const p2 = new Vector2(Math.cos(ang), Math.sin(ang));
            shape.splineThru([p1, p2]);
          }
          return shape as Shape;
        }
      };

    case 'B3':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = false;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(0.3, 0.5);
          let vectors = [
            new Vector2(-0.3, 0.5),
            new Vector2(-0.3, 1),
            new Vector2(-0.7, 1),
            new Vector2(-0.9, 0.9),
            // new Vector2(-1, 0.7),
            // new Vector2(-1, 0.3),
            // new Vector2(-0.5, 0.3),
          ];
          vectors = mirrorVertices(vectors, new Vector2(1, 1));
          const center = new Vector2(0, 0);
          for(let i = 0; i < 4; i++)
          {
            const v = vectors.map(v => v.clone().rotateAround(center, Math.PI / 2 * i));
            shape.lineTo(v[0].x, v[0].y);
            shape.lineTo(v[1].x, v[1].y);
            shape.lineTo(v[2].x, v[2].y);
            shape.splineThru([v[3], v[4]]);
            shape.lineTo(v[5].x, v[5].y);
            shape.lineTo(v[6].x, v[6].y);
          }
          return shape as Shape;
        }
      };

    case 'B4':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = false;
        generate = () => {
          let shape = new ShapeWithSubdividedLines();
          shape.moveTo(0.5, -0.65);
          shape.lineTo(0.5, 0.65);
          let v = new Vector2(0.5, 0.65);
          let center = new Vector2(0, 0.65);
          
          shape.splineThru(new Array(5).fill(0).map((_, i, a) => v.clone().rotateAround(center, Math.PI/a.length*(i+1))));
          shape.lineTo(-0.5, -0.65);
          v = new Vector2(-0.5, -0.65);
          center = new Vector2(0, -0.65);
          shape.splineThru(new Array(5).fill(0).map((_, i, a) => v.clone().rotateAround(center, Math.PI/a.length*(i+1))));
          return shape as Shape;
        }
      };
  }
}

export class SweepModelGenerator extends ModelGenerator {
  shape: BaseShape;
  torsionAngle: number;
  #height: number;

  constructor(shape: BaseShape, torsionAngle: number, height: number) {
    super();
    if(!shape.canExtrude)
      throw new TypeError('Cannot extrude this shape');
    this.shape = shape;
    this.torsionAngle = torsionAngle;
    this.#height = height;
  }

  generate(): BufferGeometry {
    const shanpe = this.shape.generate();
    const extrudeSettings : ExtrudeGeometryOptions = { 
      depth: this.#height,
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelOffset: 0,
      bevelThickness: 0.01,
      bevelSegments: 2,
      steps: 30,
      curveSegments: 20,
    };
    const geometry = new ExtrudeGeometry(shanpe, extrudeSettings);

    const vertices = geometry.attributes.position;
    const quaternion = new Quaternion();
    for (let i = 0; i < vertices.count; i++) {
      let pos = new Vector3();
      pos.fromBufferAttribute(vertices, i);
      const upVec = new Vector3(0, 0, 1);

      quaternion.setFromAxisAngle(
        upVec, 
        (Math.PI/180 * this.torsionAngle) * (pos.z / this.#height)
      );

      pos = pos.applyQuaternion(quaternion);
      vertices.setXY(i, pos.x, pos.y);
    }
    vertices.needsUpdate = true;
    //Rotate to extrude upwards
    geometry.rotateX(-Math.PI/2);
    geometry.scale(0.5, 1, 0.5);

    return geometry;
  }

  get height(): number {
    return this.#height;
  }
}

export class RevolveModelGenerator extends ModelGenerator {
  shape: BaseShape;

  constructor(shape: BaseShape) {
    super();
    if(!shape.canRevolve)
      throw new TypeError('Cannot revolve this shape');
    this.shape = shape;
  }

  generate(): BufferGeometry {
    const shanpe = this.shape.generate();
    const points = shanpe.extractPoints(50);
    const geometry = new LatheGeometry(points.shape);
    
    return geometry;
  }

  get height(): number {
    return 1;
  }
}

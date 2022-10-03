import { BufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, LatheGeometry, Quaternion, Shape, Vector2, Vector3 } from "three";

export const solidTypes = ["Sweep", "Revolve"] as const;
export type SolidType = typeof solidTypes[number];

export const sweepShapes = ["B1", "B2", "B3", "B4"] as const;
export type SweepShape = typeof sweepShapes[number];

export const revolveShapes = ["A1", "A2", "A3", "A4"] as const;
export type RevolveShape = typeof revolveShapes[number];

export interface ModelGenerator {
  build(): BufferGeometry;
}


export interface BaseShape {
  get canExtrude(): boolean;
  get canRevolve(): boolean;
  generate(): Shape;
}

export function generateShape(shapeType: SweepShape | RevolveShape): BaseShape {
  switch (shapeType) {
    case 'A1':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          let shape = new Shape();
          shape.moveTo(0, 0);
          shape.lineTo(-4/12, 0);
          shape.lineTo(-4/12, 2/12);
          shape.splineThru([new Vector2(-1/12, 3/12), new Vector2(-3/12, 6/12), new Vector2(-1/12, 6/12 + 6/12 - 3/12)]);
          shape.lineTo(-4/12, 1 - 2/12);
          shape.lineTo(-4/12, 1);
          shape.lineTo(0, 1);
          return shape;
        }
      };

    case 'A2':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          let shape = new Shape();
          shape.moveTo(0, 0);
          shape.splineThru([new Vector2(-30/175, 1/175), new Vector2(-52/175, 24/175), new Vector2(-32/175, 88/175)]);
          shape.lineTo(-32/175, 103/175);
          shape.splineThru([new Vector2(-39/175, 120/175), new Vector2(-50/175, 138/175), new Vector2(-55/175, 148/175)]);
          shape.lineTo(-55/175, 155/175);
          shape.splineThru([new Vector2(-50/175, 159/175), new Vector2(-40/175, 165/175), new Vector2(-38/175, 175/175)]);
          return shape;
        }
      };

    case 'A3':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          let shape = new Shape();
          shape.moveTo(0, 0);
          shape.lineTo(-91/179, 0);
          shape.lineTo(-23/179, 32/179);
          shape.lineTo(-23/179, 48/179);
          shape.splineThru([new Vector2(-45/179, 57/179), new Vector2(-65/179, 70/179), new Vector2(-73/179, 87/179)]);
          shape.splineThru([new Vector2(-73/179, 122/179), new Vector2(-72/179, 133/179), new Vector2(-72/179, 143/179)]);
          shape.splineThru([new Vector2(-61/179, 158/179), new Vector2(-42/179, 162/179), new Vector2(-32/179, 179/179)]);
          return shape;
        }
      };

    case 'A4':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          let shape = new Shape();
          shape.moveTo(0, 0);
          shape.lineTo(-40/180, 0);
          shape.splineThru([new Vector2(-53/180, 4/180), new Vector2(-61/180, 14/180), new Vector2(-63/180, 28/180)]);
          shape.splineThru([new Vector2(-54/180, 39/180), new Vector2(-33/180, 44/180), new Vector2(-24/180, 55/180)]);
          shape.splineThru([new Vector2(-26/180, 75/180), new Vector2(-49/180, 93/180), new Vector2(-95/180, 102/180)]);
          shape.splineThru([new Vector2(-69/180, 107/180), new Vector2(-48/180, 120/180), new Vector2(-43/180, 145/180)]);
          shape.splineThru([new Vector2(-35/180, 163/180), new Vector2(-20/180, 176/180), new Vector2(-3/180, 180/180)]);
          return shape;
        }
      };

    case 'B1':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          let shape = new Shape();
          shape.moveTo(Math.cos(Math.PI/3), Math.sin(Math.PI/3));
          shape.lineTo(Math.cos(Math.PI), Math.sin(Math.PI));
          shape.lineTo(Math.cos(-Math.PI/3), Math.sin(-Math.PI/3));
          shape.lineTo(Math.cos(Math.PI/3), Math.sin(Math.PI/3));
          return shape;
        }
      };

    case 'B2':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          let shape = new Shape();
          let ang = 0;
          shape.moveTo(Math.cos(ang), Math.sin(ang));
          for(let i = 1; i < 7*2;)
          {
            ang = Math.PI / 7 * i++;
            const p1 = new Vector2(Math.cos(ang), Math.sin(ang)).multiplyScalar(0.6);
            ang = Math.PI / 7 * i++;
            const p2 = new Vector2(Math.cos(ang), Math.sin(ang));
            console.log(ang);
            shape.splineThru([p1, p2]);
          }
          return shape;
        }
      };

    case 'B3':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
        }
      };

    case 'B4':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
        }
      };
  }
}

export class SweepModelGenerator implements ModelGenerator {
  shape: BaseShape;
  torsionAngle: number;
  height: number;

  constructor(shape: BaseShape, torsionAngle: number, height: number) {
    if(!shape.canExtrude)
      throw new TypeError('Cannot extrude this shape');
    this.shape = shape;
    this.torsionAngle = torsionAngle;
    this.height = height;
  }

  build(): BufferGeometry {
    const shanpe = this.shape.generate();
    const extrudeSettings : ExtrudeGeometryOptions = { 
      depth: this.height,
      bevelEnabled: false,
      steps: 10,
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
        (Math.PI/180 * this.torsionAngle) * (pos.z / this.height)
      );

      pos = pos.applyQuaternion(quaternion);
      vertices.setXY(i, pos.x, pos.y);
    }
    vertices.needsUpdate = true;
    //Rotate to extrude upwards
    geometry.rotateX(-Math.PI/2);
    return geometry;
  }
}

export class RevolveModelGenerator implements ModelGenerator {
  shape: BaseShape;

  constructor(shape: BaseShape) {
    if(!shape.canRevolve)
      throw new TypeError('Cannot revolve this shape');
    this.shape = shape;
  }

  build(): BufferGeometry {
    const shanpe = this.shape.generate();
    const points = shanpe.extractPoints(50);
    const geometry = new LatheGeometry(points.shape);
    
    return geometry;
  }
}

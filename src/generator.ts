import { BoxGeometry, BufferGeometry, CubicBezierCurve, ExtrudeGeometry, LatheGeometry, Shape, Vector2 } from "three";


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
          shape.lineTo(-0.1, 0);
          shape.lineTo(-0.1, 0.05);
          shape.splineThru([new Vector2(-0.025, 0.075), new Vector2(-0.075, 0.15), new Vector2(-0.025, 0.15 + 0.15 - 0.075)]);
          shape.lineTo(-0.1, 0.3 - 0.05);
          shape.lineTo(-0.1, 0.3);
          shape.lineTo(0, 0.3);
          return shape;
        }
      };

    case 'A2':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
        }
      };

    case 'A3':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
        }
      };

    case 'A4':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
        }
      };

    case 'B1':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
        }
      };

    case 'B2':
      return new class implements BaseShape {
        canExtrude = true;
        canRevolve = true;
        generate = () => {
          throw new Error();
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
    const geometry = new ExtrudeGeometry(shanpe, { depth: this.height });

    ///TODO: Twisting
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

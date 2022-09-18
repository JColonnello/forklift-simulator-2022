import { GUI, GUIController } from "dat.gui";

function generate3Dprint() {
  console.log("Printing!");
}

const solidTypes = ["Sweep", "Revolve"] as const;
type SolidType = typeof solidTypes[number];

const sweepShapes = ["B1", "B2", "B3", "B4"] as const;
type SweepShape = typeof sweepShapes[number];

const revolveShapes = ["A1", "A2", "A3", "A4"] as const;
type RevolveShape = typeof revolveShapes[number];

interface ModelGenerator {
}

class SweepModelLayerGenerator implements ModelGenerator {
  shape: SweepShape;
  torsionAngle: number;
  height: number;

  constructor(shape: SweepShape, torsionAngle: number, height: number) {
    this.shape = shape;
    this.torsionAngle = torsionAngle;
    this.height = height;
  }
}

class RevolveModelLayerGenerator implements ModelGenerator {
  shape: RevolveShape;

  constructor(shape: RevolveShape) {
    this.shape = shape;
  }
}

let printOptions: {
  type: SolidType;
  sweepShape: SweepShape;
  torsionAngle: number;
  revolveShape: RevolveShape;
  height: number;
} = {
  type: "Sweep",
  sweepShape: "B1",
  revolveShape: "A1",
  torsionAngle: 0,
  height: 0.5,
};

export function setupGui(startPring: (generator: ModelGenerator) => void) {
  const gui = new GUI();
  function setSolidType(value: SolidType) {
    switch (value) {
      case "Sweep":
        revolveFolder.hide();
        sweepFolder.show();
        break;
      case "Revolve":
        revolveFolder.show();
        sweepFolder.hide();
        break;
    }
  }

  const solidType = gui
    .add(printOptions, "type", solidTypes)
    .name("Solid Type")
    .onFinishChange(setSolidType);
  const revolveFolder = gui.addFolder("Revolve");
  revolveFolder.add(printOptions, "revolveShape", revolveShapes).name("Shape");
  revolveFolder.open();
  const sweepFolder = gui.addFolder("Sweep");
  sweepFolder.add(printOptions, "sweepShape", sweepShapes).name("Shape");
  sweepFolder.add(printOptions, "torsionAngle", 0, 360, 1).name("Torsion");
  sweepFolder.add(printOptions, "height", 0, 2).name("Height");
  sweepFolder.open();
  gui.add({ button: () => {
    let modelLayerGenerator;
    switch (printOptions.type) {
      case "Sweep":
        modelLayerGenerator = new SweepModelLayerGenerator(printOptions.sweepShape, printOptions.torsionAngle, printOptions.height);
        break;
      case "Revolve":
        modelLayerGenerator = new RevolveModelLayerGenerator(printOptions.revolveShape);
        break;
    }

    startPring(modelLayerGenerator);
  } }, "button").name("Generate");
  gui.open();

  setSolidType(solidType.getValue());
}

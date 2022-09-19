import { GUI } from "dat.gui";
import { generateShape, ModelGenerator, RevolveModelGenerator, RevolveShape, revolveShapes, SolidType, solidTypes, SweepModelGenerator, SweepShape, sweepShapes } from "./generator";

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
        modelLayerGenerator = new SweepModelGenerator(generateShape(printOptions.sweepShape), printOptions.torsionAngle, printOptions.height);
        break;
      case "Revolve":
        modelLayerGenerator = new RevolveModelGenerator(generateShape(printOptions.revolveShape));
        break;
    }

    startPring(modelLayerGenerator);
  } }, "button").name("Generate");
  gui.open();

  setSolidType(solidType.getValue());
}

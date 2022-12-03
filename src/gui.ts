import { GUI } from "dat.gui";
import {
  generateShape,
  ModelGenerator,
  RevolveModelGenerator,
  RevolveShape,
  revolveShapes,
  SolidType,
  solidTypes,
  SweepModelGenerator,
  SweepShape,
  sweepShapes,
} from "./generator";
import { Patterns, textures } from "./printTextures";

let printOptions: {
  type: SolidType;
  sweepShape: SweepShape;
  torsionAngle: number;
  revolveShape: RevolveShape;
  height: number;
  texturePattern: Patterns;
  textureVariant: string;
} = {
  type: "Revolve",
  sweepShape: "B1",
  revolveShape: "A1",
  torsionAngle: 0,
  height: 0.5,
  texturePattern: "Pattern 1",
  textureVariant: "A",
};

export function setupGui(startPring: (generator: ModelGenerator, texture: string) => void) {
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

  function setTexturePattern(pattern: Patterns) {
    const options = Object.keys(textures[pattern]);
    let element: HTMLSelectElement = textureVariant.domElement.children[0] as HTMLSelectElement;
    element.innerHTML = "";

    element.value = options[0];
    printOptions.textureVariant = options[0];

    for (const variant of options) {
      let option = document.createElement("option");
      option.setAttribute("value", variant);
      option.innerHTML = variant;
      element.appendChild(option);
    }
  }

  gui
    .add(printOptions, "texturePattern", Object.keys(textures))
    .name("Texture")
    .onFinishChange(setTexturePattern);
  const textureVariant = gui
    .add(printOptions, "textureVariant", [])
    .name("Texture Variant");
  setTexturePattern(printOptions.texturePattern);

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
  gui
    .add(
      {
        button: () => {
          let modelLayerGenerator;
          switch (printOptions.type) {
            case "Sweep":
              modelLayerGenerator = new SweepModelGenerator(
                generateShape(printOptions.sweepShape),
                printOptions.torsionAngle,
                printOptions.height
              );
              break;
            case "Revolve":
              modelLayerGenerator = new RevolveModelGenerator(
                generateShape(printOptions.revolveShape)
              );
              break;
          }

          startPring(modelLayerGenerator, textures[printOptions.texturePattern][printOptions.textureVariant] as string);
        },
      },
      "button"
    )
    .name("Generate");
  gui.open();

  setSolidType(solidType.getValue());
}

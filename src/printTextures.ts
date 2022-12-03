type TextureWithVariants = { [key: string]: string };
export const textures = {
  Marble: {
    A: "Marble03_1K_BaseColor.png",
    B: "Marble09_1K_BaseColor.png",
  } as TextureWithVariants,
  "Pattern 1": {
    A: "Pattern05_1K_VarA.png",
    B: "Pattern05_1K_VarB.png",
    C: "Pattern05_1K_VarC.png",
  } as TextureWithVariants,
  "Pattern 2": {
    A: "Pattern02_1K_VarA.png",
    B: "Pattern02_1K_VarB.png",
    C: "Pattern02_1K_VarC.png",
  } as TextureWithVariants,
  "Pattern 3": {
    A: "patron3.png",
  } as TextureWithVariants,
} as const;

export type Patterns = keyof typeof textures;

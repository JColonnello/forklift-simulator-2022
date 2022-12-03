import * as THREE from "three";
const textureLoader = new THREE.TextureLoader();

export function loadTexture(name: string) {
  return textureLoader.load(`assets/textures/${name}`);
}

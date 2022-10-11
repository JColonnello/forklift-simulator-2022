import {BufferAttribute, BufferGeometry, Vector3} from "three";

export function mergeVertices(geometry: BufferGeometry): BufferGeometry {
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');

  const map = new Map();
  
  function getVecHash(v: Vector3) {
    return `${v.x},${v.y},${v.z}`;
  }

  if (position.count != normal.count) {
    throw "There should be the same amount of positions as normals";
  }

  const count = position.count;
  const newIndices = [];

  for (let i = 0; i < count; i++) {
    const p = new Vector3(
      position.array[i * position.itemSize + 0],
      position.array[i * position.itemSize + 1],
      position.array[i * position.itemSize + 2],
    );

    const posHash = getVecHash(p);
    if (!map.has(posHash)) {
      map.set(posHash, i);
    }
    newIndices.push(map.get(posHash));
  }

  geometry.setIndex(newIndices)

  console.log(map);
  
  
  return geometry;
}

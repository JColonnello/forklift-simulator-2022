import {BufferGeometry, Vector3} from "three";

export function mergeVertices(geometry: BufferGeometry, presicionDigits = 3): BufferGeometry {
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const indices = geometry.getIndex();

  const map = new Map();

  function getVecHash(v: Vector3) {
    const x = v.x.toFixed(presicionDigits);
    const y = v.y.toFixed(presicionDigits);
    const z = v.z.toFixed(presicionDigits);
    return `${x},${y},${z}`;
  }

  if (position.count != normal.count) {
    throw "There should be the same amount of positions as normals";
  }

  const count = position.count;
  const indexMap = new Map();

  const p = new Vector3();
  for (let i = 0; i < count; i++) {
    p.set(
      position.array[i * position.itemSize + 0],
      position.array[i * position.itemSize + 1],
      position.array[i * position.itemSize + 2],
    );

    const posHash = getVecHash(p);
    
    const newIndex = map.get(posHash);
    if (newIndex === undefined) {
      map.set(posHash, i);
    }

    indexMap.set(i, newIndex ?? i);
  }

  const newIndices = [];

  if (indices !== null) {
    for (let i = 0; i < indices.count; i++) {
      let index = indices.array[i];
      
      newIndices.push(indexMap.get(index));
    }
  } else {
    for (let i = 0; i < count; i++) {
      p.set(
        position.array[i * position.itemSize + 0],
        position.array[i * position.itemSize + 1],
        position.array[i * position.itemSize + 2],
      );

      const posHash = getVecHash(p);
      newIndices.push(map.get(posHash));
    }
  }
  geometry.setIndex(newIndices);
  
  return geometry;
}

import { BufferGeometry, Vector2, Vector3 } from "three";

export function mergeVertices(
  geometry: BufferGeometry,
  presicionDigits = 3
): BufferGeometry {
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const uv = geometry.getAttribute("uv");
  const indices = geometry.getIndex();

  const map = new Map();

  function getVecHash(p: Vector3, t: Vector2) {
    const x = p.x.toFixed(presicionDigits);
    const y = p.y.toFixed(presicionDigits);
    const z = p.z.toFixed(presicionDigits);
    const u = t.x.toFixed(presicionDigits);
    const v = t.y.toFixed(presicionDigits);
    return `${x},${y},${z},${u},${v}`;
  }

  if (position.count != normal.count) {
    throw "There should be the same amount of positions as normals";
  }

  const count = position.count;
  const indexMap = new Map();

  const p = new Vector3();
  const t = new Vector2();
  for (let i = 0; i < count; i++) {
    p.set(
      position.array[i * position.itemSize + 0],
      position.array[i * position.itemSize + 1],
      position.array[i * position.itemSize + 2]
    );
    t.set(
      uv.array[i * uv.itemSize + 0],
      uv.array[i * uv.itemSize + 1]
    )

    const posHash = getVecHash(p, t);

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
        position.array[i * position.itemSize + 2]
      );
      t.set(
        uv.array[i * uv.itemSize + 0],
        uv.array[i * uv.itemSize + 1]
      )

      const posHash = getVecHash(p, t);
      newIndices.push(map.get(posHash));
    }
  }
  geometry.setIndex(newIndices);

  return geometry;
}

// https://adventofcode.com/2022/day/18
// Day 17: Pyroclastic Flow

import { readInput } from '../../common/index';

type Cube = [number, number, number];
enum CubeType {
  Lava = 1,
  Air = 2,
  OutsideAir = 4,
}
type CubesMap = {
  [index: string]: CubeType;
};

const cubes: Cube[] = readInput('days/day18/input02', '\n').map((line) => {
  const [x, y, z] = line.split(',').map(Number);

  return [x, y, z];
});

const cubesMap: CubesMap = readInput('days/day18/input02', '\n').reduce((map: CubesMap, line: string) => {
  const [x, y, z] = line.split(',');
  map[`${x}|${y}|${z}`] = CubeType.Lava;
  return map;
}, {});

function nextToEachOther([aX, aY, aZ]: Cube, [bX, bY, bZ]: Cube): boolean {
  if (aX === bX && aY === bY && Math.abs(aZ - bZ) === 1) return true;
  if (aX === bX && Math.abs(aY - bY) === 1 && aZ === bZ) return true;
  if (Math.abs(aX - bX) === 1 && aY === bY && aZ === bZ) return true;

  return false;
}

let openSides = 0;
for (const mainCube of cubes) {
  let cubeSides = 6;

  for (const testCube of cubes) {
    if (mainCube === testCube) continue;
    if (nextToEachOther(mainCube, testCube)) cubeSides -= 1;
  }

  openSides += cubeSides;
}

const mapXLimits = [-1 + Math.min(...cubes.map(([x]) => x)), 1 + Math.max(...cubes.map(([x]) => x))];
const mapYLimits = [-1 + Math.min(...cubes.map(([, y]) => y)), 1 + Math.max(...cubes.map(([, y]) => y))];
const mapZLimits = [-1 + Math.min(...cubes.map(([, , z]) => z)), 1 + Math.max(...cubes.map(([, , z]) => z))];

for (let x = mapXLimits[0]; x <= mapXLimits[1]; x++) {
  for (let y = mapYLimits[0]; y <= mapYLimits[1]; y++) {
    for (let z = mapZLimits[0]; z <= mapZLimits[1]; z++) {
      const cubeKey = `${x}|${y}|${z}`;
      cubesMap[cubeKey] ??= CubeType.Air;

      if (mapXLimits.includes(x) || mapYLimits.includes(y) || mapZLimits.includes(z)) cubesMap[cubeKey] = CubeType.OutsideAir;
    }
  }
}

function hasOutsideNeighbor([x, y, z]: Cube): boolean {
  const neighbors: Cube[] = [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];

  for (const [nX, nY, nZ] of neighbors) {
    const nCubeKey = `${nX}|${nY}|${nZ}`;
    if (cubesMap[nCubeKey] === CubeType.OutsideAir) return true;
  }
  return false;
}

let outsideAirFound = true;
while (outsideAirFound) {
  outsideAirFound = false;

  for (let x = mapXLimits[0]; x <= mapXLimits[1]; x++) {
    for (let y = mapYLimits[0]; y <= mapYLimits[1]; y++) {
      for (let z = mapZLimits[0]; z <= mapZLimits[1]; z++) {
        const cubeKey = `${x}|${y}|${z}`;
        if (cubesMap[cubeKey] !== CubeType.Air) continue;

        if (hasOutsideNeighbor([x, y, z])) {
          outsideAirFound = true;
          cubesMap[cubeKey] = CubeType.OutsideAir;
        }
      }
    }
  }
}
let outsideSides = 0;
for (const cube of Object.keys(cubesMap)) {
  if (cubesMap[cube] !== CubeType.Lava) continue;
  const [x, y, z] = cube.split('|').map(Number);
  const neighbors: Cube[] = [
    [x + 1, y, z],
    [x - 1, y, z],
    [x, y + 1, z],
    [x, y - 1, z],
    [x, y, z + 1],
    [x, y, z - 1],
  ];

  outsideSides += neighbors.reduce((total, [nX, nY, nZ]: Cube) => {
    if (cubesMap[`${nX}|${nY}|${nZ}`] === CubeType.OutsideAir) return total + 1;
    return total;
  }, 0);
}

process.stdout.write(`Part 01: ${openSides}\n`);
process.stdout.write(`Part 02: ${outsideSides}\n`);

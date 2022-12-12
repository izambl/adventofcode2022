// https://adventofcode.com/2022/day/12
// Day 12: Hill Climbing Algorithm

import { readInput } from '../../common/index';

const map = readInput('days/day12/input02', '\n').map((line) => line.split(''));

type Point = [number, number];

let validPaths: string[][] = [];

function getHeight(letter: string): number {
  if (letter === 'S') return 'a'.charCodeAt(0);
  if (letter === 'E') return 'z'.charCodeAt(0);

  return letter.charCodeAt(0);
}

let globalPointDistance: { [index: string]: number } = {};
function walk(currentPoint: Point, path: string[]) {
  const [y, x] = currentPoint;
  const key = `${y}-${x}`;
  const point = map[y][x];
  const height = getHeight(point);

  const distanceToGetHere = path.length;
  if (globalPointDistance[key] !== undefined && globalPointDistance[key] <= distanceToGetHere) return;
  globalPointDistance[key] = distanceToGetHere;

  if (point === 'E') {
    validPaths.push(path);
    return;
  }

  path.push(key);

  const nextPoints = [
    [y, x - 1],
    [y, x + 1],
    [y - 1, x],
    [y + 1, x],
  ];

  for (const nextPoint of nextPoints) {
    const [nY, nX] = nextPoint;
    const nKey = `${nY}-${nX}`;

    const nPoint = map[nY]?.[nX];
    if (!nPoint) continue;

    const nHeight = getHeight(nPoint);

    if (path.includes(nKey)) continue;
    if (nHeight - height <= 1) {
      walk([nY, nX], [...path]);
    }
  }
}

let startPoint: Point = [0, 0];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === 'S') {
      startPoint = [y, x];
    }
  }
}
walk(startPoint, []);
const part01 = Math.min(...validPaths.map((path) => path.length));

const startingPoints: Point[] = [];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === 'S' || map[y][x] === 'a') {
      startingPoints.push([y, x]);
    }
  }
}

const hikingLenghts = startingPoints.map((start: Point) => {
  validPaths = [];
  globalPointDistance = {};
  walk(start, []);

  const distance = Math.min(...validPaths.map((path) => path.length));

  console.log('Hiking from:', start, distance);
  return distance;
});

const part02 = Math.min(...hikingLenghts);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

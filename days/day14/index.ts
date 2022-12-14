// https://adventofcode.com/2022/day/14
// Day 14: Regolith Reservoir

import { readInput } from '../../common/index';

const input = readInput('days/day14/input01', '\n').map((pair) => pair.split(' -> '));

type Point = [number, number];
const sandStartPoint: Point = [500, 0];
enum Status {
  Rock = 2,
  Sand = 3,
}
const mapPart01: { [index: string]: Status } = {};

// Fill Map
for (const structure of input) {
  for (let i = 1; i < structure.length; i++) {
    let [fromX, fromY] = structure[i - 1].split(',').map(Number);
    let [toX, toY] = structure[i].split(',').map(Number);

    mapPart01[`${fromX}|${fromY}`] = Status.Rock;
    mapPart01[`${toX}|${toY}`] = Status.Rock;

    while (fromX < toX) {
      fromX++;
      mapPart01[`${fromX}|${fromY}`] = Status.Rock;
    }
    while (fromX > toX) {
      fromX--;
      mapPart01[`${fromX}|${fromY}`] = Status.Rock;
    }
    while (fromY < toY) {
      fromY++;
      mapPart01[`${fromX}|${fromY}`] = Status.Rock;
    }
    while (fromY > toY) {
      fromY--;
      mapPart01[`${fromX}|${fromY}`] = Status.Rock;
    }
  }
}

const mapPart02 = JSON.parse(JSON.stringify(mapPart01));

const lastY = Math.max(
  ...Object.keys(mapPart01).map((points) => {
    const [, y] = points.split('|');
    return Number(y);
  })
);
const floor = lastY + 2;

let bottomReached = false;
let part01SandCount = 0;
while (!bottomReached) {
  part01SandCount++;
  const sand: Point = [...sandStartPoint];

  while (sand[1] < lastY && moveSand(sand, mapPart01)) {}

  mapPart01[`${sand[0]}|${sand[1]}`] = Status.Sand;
  if (sand[1] >= lastY) bottomReached = true;
}

let canFall = true;
let part02SandCount = 0;
while (canFall) {
  part02SandCount++;
  const sand: Point = [...sandStartPoint];

  while (sand[1] + 1 !== floor && moveSand(sand, mapPart02)) {}

  mapPart02[`${sand[0]}|${sand[1]}`] = Status.Sand;
  if (sand[0] === sandStartPoint[0] && sand[1] === sandStartPoint[1]) canFall = false;
}

function moveSand(sand: Point, map: { [index: string]: Status }): boolean {
  const [x, y] = sand;

  let tryPos = map[`${x}|${y + 1}`];
  if (!tryPos) {
    sand[1] = y + 1;
    return true;
  }

  tryPos = map[`${x - 1}|${y + 1}`];
  if (!tryPos) {
    sand[1] = y + 1;
    sand[0] = x - 1;
    return true;
  }

  tryPos = map[`${x + 1}|${y + 1}`];
  if (!tryPos) {
    sand[1] = y + 1;
    sand[0] = x + 1;
    return true;
  }

  return false;
}

function printMap(map: { [index: string]: Status }) {
  const mapToPrint: string[][] = [];
  const lowerX = Math.min(
    ...Object.keys(mapPart01).map((points) => {
      const [x] = points.split('|');
      return Number(x);
    })
  );

  let maxX = 0;
  let minX = 0;

  for (const key of Object.keys(map)) {
    const [x, y] = key.split('|').map(Number);

    maxX = Math.max(maxX, x - lowerX);
    minX = Math.min(minX, x - lowerX);

    mapToPrint[y] = mapToPrint[y] || [];
    mapToPrint[y][x - lowerX] = map[key] === Status.Rock ? '⬜️' : '🟨';
  }

  process.stdout.write('⬛️'.repeat(maxX - minX + 5));
  for (let y = 0; y < mapToPrint.length; y++) {
    process.stdout.write('\n');
    if (!mapToPrint[y]) {
      process.stdout.write('⬛️'.repeat(maxX - minX + 5));
      continue;
    }
    for (let x = minX - 2; x < maxX + 3; x++) {
      if (!mapToPrint[y]?.[x]) {
        process.stdout.write('⬛️');
        continue;
      }
      process.stdout.write(mapToPrint[y]?.[x]);
    }
  }
  process.stdout.write('\n');
}

printMap(mapPart01);
printMap(mapPart02);

process.stdout.write(`Part 01: ${part01SandCount - 1}\n`);
process.stdout.write(`Part 01: ${part02SandCount}\n`);

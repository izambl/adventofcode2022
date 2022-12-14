// https://adventofcode.com/2022/day/14
// Day 14: Regolith Reservoir

import { readInput } from '../../common/index';

const input = readInput('days/day14/input02', '\n').map((pair) => pair.split(' -> '));

type Point = [number, number];
const sandStartPoint: Point = [500, 0];
enum Status {
  Empty = 1,
  Rock = 2,
  Sand = 3,
}
const mapWithoutFloor: { [index: string]: Status } = {};

// Fill Map
for (const structure of input) {
  for (let i = 1; i < structure.length; i++) {
    let [fromX, fromY] = structure[i - 1].split(',').map(Number);
    let [toX, toY] = structure[i].split(',').map(Number);

    mapWithoutFloor[`${fromX}|${fromY}`] = Status.Rock;
    mapWithoutFloor[`${toX}|${toY}`] = Status.Rock;

    while (fromX < toX) {
      fromX++;
      mapWithoutFloor[`${fromX}|${fromY}`] = Status.Rock;
    }
    while (fromX > toX) {
      fromX--;
      mapWithoutFloor[`${fromX}|${fromY}`] = Status.Rock;
    }
    while (fromY < toY) {
      fromY++;
      mapWithoutFloor[`${fromX}|${fromY}`] = Status.Rock;
    }
    while (fromY > toY) {
      fromY--;
      mapWithoutFloor[`${fromX}|${fromY}`] = Status.Rock;
    }
  }
}

const mapWithFloor = JSON.parse(JSON.stringify(mapWithoutFloor));

const lastY = Math.max(
  ...Object.keys(mapWithoutFloor).map((points) => {
    const [, y] = points.split('|');
    return Number(y);
  })
);
const floor = lastY + 2;

let bottomReached = false;
let part01Sands = 0;
while (!bottomReached) {
  part01Sands++;
  const sand: Point = [...sandStartPoint];

  while (moveSand(sand)) {}

  mapWithoutFloor[`${sand[0]}|${sand[1]}`] = Status.Sand;
}

let canFall = true;
let part02Sands = 0;
while (canFall) {
  part02Sands++;
  const sand: Point = [...sandStartPoint];

  while (moveSand2(sand)) {}

  mapWithFloor[`${sand[0]}|${sand[1]}`] = Status.Sand;
  if (sand[0] === sandStartPoint[0] && sand[1] === sandStartPoint[1]) canFall = false;
}

function moveSand2(sand: Point): boolean {
  const [x, y] = sand;

  if (y + 1 === floor) return false;

  let tryPos = mapWithFloor[`${x}|${y + 1}`];
  if (!tryPos || tryPos === Status.Empty) {
    sand[1] = y + 1;
    return true;
  }

  tryPos = mapWithFloor[`${x - 1}|${y + 1}`];
  if (!tryPos || tryPos === Status.Empty) {
    sand[1] = y + 1;
    sand[0] = x - 1;
    return true;
  }

  tryPos = mapWithFloor[`${x + 1}|${y + 1}`];
  if (!tryPos || tryPos === Status.Empty) {
    sand[1] = y + 1;
    sand[0] = x + 1;
    return true;
  }

  return false;
}

function moveSand(sand: Point): boolean {
  const [x, y] = sand;

  if (y > lastY) {
    bottomReached = true;
    return false;
  }

  let tryPos = mapWithoutFloor[`${x}|${y + 1}`];
  if (!tryPos || tryPos === Status.Empty) {
    sand[1] = y + 1;
    return true;
  }

  tryPos = mapWithoutFloor[`${x - 1}|${y + 1}`];
  if (!tryPos || tryPos === Status.Empty) {
    sand[1] = y + 1;
    sand[0] = x - 1;
    return true;
  }

  tryPos = mapWithoutFloor[`${x + 1}|${y + 1}`];
  if (!tryPos || tryPos === Status.Empty) {
    sand[1] = y + 1;
    sand[0] = x + 1;
    return true;
  }

  return false;
}

process.stdout.write(`Part 01: ${part01Sands - 1}\n`);
process.stdout.write(`Part 01: ${part02Sands}\n`);

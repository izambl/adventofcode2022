// https://adventofcode.com/2022/day/15
// Day 15: Beacon Exclusion Zone

import { readInput } from '../../common/index';

const input = readInput('days/day15/input01', '\n').map((sensorDescription) => {
  const [, sX, sY, bX, bY] = sensorDescription.match(/x=(-?\d+).+y=(-?\d+).+x=(-?\d+).+y=(-?\d+)/);

  return [sX, sY, bX, bY].map(Number);
});
const beaconLine = 10;
const maxCoordinate = 20;

type Map = { [index: string]: string };
const map: Map = {};
const sensorDistances: { x: number; y: number; distance: number }[] = [];

let blockedRegions: { [index: string]: boolean } = {};
function countBlockedRegions(distance: number, from: [number, number], line: number) {
  const [x, y] = from;

  let leftX = x;
  let rightX = x;
  let stop = false;
  while (!stop) {
    const leftDistance = Math.abs(x - leftX) + Math.abs(y - line);
    const rightDistance = Math.abs(x - rightX) + Math.abs(y - line);

    if (leftDistance <= distance && map[`${leftX}|${line}`] !== 'B') {
      blockedRegions[`${leftX}`] = true;
    }
    if (rightDistance <= distance && map[`${rightX}|${line}`] !== 'B') {
      blockedRegions[`${rightX}`] = true;
    }
    stop = rightDistance > distance && leftDistance > distance;
    leftX -= 1;
    rightX += 1;
  }
}

for (const sensor of input) {
  const [sX, sY, bX, bY] = sensor;

  map[`${sX}|${sY}`] = 'S';
  map[`${bX}|${bY}`] = 'B';
  const distance = Math.abs(sX - bX) + Math.abs(sY - bY);
  countBlockedRegions(distance, [sX, sY], beaconLine);
  sensorDistances.push({ x: sX, y: sY, distance });
}

let rogueBeacon: [number, number] = [0, 0];
let found = false;
for (let x = 0; x <= maxCoordinate; x++) {
  if (found) break;
  for (let y = 0; y <= maxCoordinate; y++) {
    found = sensorDistances.every((sensor) => {
      const distanceToPos = Math.abs(x - sensor.x) + Math.abs(y - sensor.y);
      return distanceToPos > sensor.distance;
    });

    if (found) {
      rogueBeacon[0] = x;
      rogueBeacon[1] = y;
      break;
    }
  }
}

const part01 = Object.keys(blockedRegions).length;
const part02 = rogueBeacon[0] * 4000000 + rogueBeacon[1];
process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

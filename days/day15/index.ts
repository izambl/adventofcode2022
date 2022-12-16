// https://adventofcode.com/2022/day/15
// Day 15: Beacon Exclusion Zone

import { readInput } from '../../common/index';

const input = readInput('days/day15/input02', '\n').map((sensorDescription) => {
  const [, sX, sY, bX, bY] = sensorDescription.match(/x=(-?\d+).+y=(-?\d+).+x=(-?\d+).+y=(-?\d+)/);

  return [sX, sY, bX, bY].map(Number);
});
const beaconLine = 2000000;
const maxCoordinate = 4000000;

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

const rogueBeacon = [0, 0];

sensorDistances.find((sensorDistance) => {
  const { y, x, distance } = sensorDistance;

  for (let spacer = distance + 1; spacer >= 0; spacer--) {
    const bottomRight = [x + spacer, y + (distance + 1 - spacer)];
    const topRight = [x + spacer, y - (distance + 1 - spacer)];
    const bottomLeft = [x - spacer, y + (distance + 1 - spacer)];
    const topLeft = [x - spacer, y - (distance + 1 - spacer)];
    const points = [bottomRight, topRight, bottomLeft, topLeft];

    for (const [pX, pY] of points) {
      if (pX < 0 || pY < 0 || pX > maxCoordinate || pY > maxCoordinate) continue;

      const found = sensorDistances.every((sensor) => {
        const distanceToPos = Math.abs(pX - sensor.x) + Math.abs(pY - sensor.y);
        return distanceToPos > sensor.distance;
      });

      if (found) {
        rogueBeacon[0] = pX;
        rogueBeacon[1] = pY;
        return true;
      }
    }
  }
});

const part01 = Object.keys(blockedRegions).length;
const part02 = rogueBeacon[0] * 4000000 + rogueBeacon[1];
process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

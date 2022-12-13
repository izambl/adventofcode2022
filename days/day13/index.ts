// https://adventofcode.com/2022/day/13
// Day 13: Distress Signal

import { readInput } from '../../common/index';

const input = readInput('days/day13/input02', '\n\n').map((pair) => pair.split('\n').map((code) => JSON.parse(code)));

type Packet = number[];

function compare(left: Packet, right: Packet): boolean {
  let l = left.shift();
  let r = right.shift();

  while (l !== undefined || r !== undefined) {
    if (typeof l === 'number' && typeof r === 'number') {
      if (l < r) return true;
      if (l > r) return false;
    }

    if (l === undefined && r !== undefined) return true;
    if (l !== undefined && r === undefined) return false;

    if (Array.isArray(l) && Array.isArray(r)) {
      const result = compare(l, r);
      if (result === true || result === false) return result;
    }
    if (typeof l === 'number' && Array.isArray(r)) {
      const result = compare([l], r);
      if (result === true || result === false) return result;
    }
    if (Array.isArray(l) && typeof r === 'number') {
      const result = compare(l, [r]);
      if (result === true || result === false) return result;
    }

    l = left.shift();
    r = right.shift();
  }

  return;
}

const part01 = JSON.parse(JSON.stringify(input)).reduce((total: number, [left, right]: [Packet, Packet], index: number) => {
  const result = compare(left, right);
  if (result) {
    return total + index + 1;
  }
  return total;
}, 0);

const allPackets = JSON.parse(JSON.stringify(input)).reduce(
  (total: Packet[], [left, right]: [Packet, Packet]) => {
    return [...total, left, right];
  },
  [[[2]], [[6]]]
);

const ValidLefts: { [index: number]: number[] } = {};
for (let i = 0; i < allPackets.length; i++) {
  const right = allPackets[i];
  ValidLefts[i] ??= [];

  for (let j = 0; j < allPackets.length; j++) {
    if (i === j) continue;
    const left = allPackets[j];

    if (compare(JSON.parse(JSON.stringify(left)), JSON.parse(JSON.stringify(right)))) {
      ValidLefts[i].push(j);
    }
  }
}

const orderedPoints = [];
while (Object.keys(ValidLefts).length) {
  const nextPoint = Number(Object.keys(ValidLefts).find((key) => ValidLefts[Number(key)].length === 0));
  orderedPoints.push(nextPoint);
  delete ValidLefts[nextPoint];

  for (const objKey of Object.keys(ValidLefts)) {
    ValidLefts[Number(objKey)].splice(ValidLefts[Number(objKey)].indexOf(nextPoint), 1);
  }
}

const part02 = (orderedPoints.indexOf(0) + 1) * (orderedPoints.indexOf(1) + 1);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

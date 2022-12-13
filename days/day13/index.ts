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

const part01 = input.reduce((total, [left, right]: [Packet, Packet], index) => {
  const result = compare(left, right);
  if (result) {
    return total + index + 1;
  }
  return total;
}, 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);

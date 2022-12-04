// https://adventofcode.com/2022/day/3
// Day 3: Rucksack Reorganization

import { readInput } from '../../common/index';

const input = readInput('days/day04/input02', '\n').map((pairs) => pairs.split(',').map((pair) => pair.split('-').map(Number)));

const fullyOverlappingSections = input.reduce((total, section) => {
  const [[aMin, aMax], [bMin, bMax]] = section;

  if (aMin >= bMin && aMin <= bMax && aMax >= bMin && aMax <= bMax) return total + 1;
  if (bMin >= aMin && bMin <= aMax && bMax >= aMin && bMax <= aMax) return total + 1;

  return total;
}, 0);

const partialOverlappingSections = input.reduce((total, section) => {
  const [[aMin, aMax], [bMin, bMax]] = section;

  if ((aMin >= bMin && aMin <= bMax) || (aMax >= bMin && aMax <= bMax)) return total + 1;
  if ((bMin >= aMin && bMin <= aMax) || (bMax >= aMin && bMax <= aMax)) return total + 1;

  return total;
}, 0);

process.stdout.write(`Part 01: ${fullyOverlappingSections}\n`);
process.stdout.write(`Part 02: ${partialOverlappingSections}\n`);

// https://adventofcode.com/2022/day/2
// Day 2: Day 2: Rock Paper Scissors

import { readInput } from '../../common/index';

// A for Rock
// B for Paper
// C for Scissors

const input = readInput('days/day02/input02', '\n').map((elf: string) => elf.split(' '));

const shapeValue: { [index: string]: number } = {
  A: 1,
  B: 2,
  C: 3,
};

const handEquivalency: { [index: string]: string } = {
  X: 'A',
  Y: 'B',
  Z: 'C',
};

const results: { [index: string]: { [index: string]: string } } = {
  // X = to Lose, Y = to Draw, Z = to Win
  A: { X: 'C', Y: 'A', Z: 'B' },
  B: { X: 'A', Y: 'B', Z: 'C' },
  C: { X: 'B', Y: 'C', Z: 'A' },
};

function play(hand1: string, hand2: string): number {
  if (hand2 === hand1) return 3 + shapeValue[hand2];

  if (hand1 === 'A' && hand2 === 'B') return 6 + shapeValue[hand2];
  if (hand1 === 'A' && hand2 === 'C') return 0 + shapeValue[hand2];

  if (hand1 === 'B' && hand2 === 'A') return 0 + shapeValue[hand2];
  if (hand1 === 'B' && hand2 === 'C') return 6 + shapeValue[hand2];

  if (hand1 === 'C' && hand2 === 'A') return 6 + shapeValue[hand2];
  if (hand1 === 'C' && hand2 === 'B') return 0 + shapeValue[hand2];

  return 0;
}

let totalScorePart01 = 0;
const input01 = input.map(([opponent, player]) => [opponent, handEquivalency[player]]);
for (const [hand1, hand2] of input01) {
  totalScorePart01 += play(hand1, hand2);
}

let totalScorePart02 = 0;
const input02 = input.map(([oponent, neededResult]) => [oponent, results[oponent][neededResult]]);
for (const [hand1, hand2] of input02) {
  totalScorePart02 += play(hand1, hand2);
}

process.stdout.write(`Part 01: ${totalScorePart01}\n`);
process.stdout.write(`Part 02: ${totalScorePart02}\n`);

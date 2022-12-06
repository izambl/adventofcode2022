// https://adventofcode.com/2022/day/6
// Day 6: Tuning Trouble

import { readInput } from '../../common/index';

const [input] = readInput('days/day06/input02');

const signal = [...input];
const part01 = signal.findIndex((element, index) => {
  return (
    signal[index] !== signal[index + 1] &&
    signal[index] !== signal[index + 2] &&
    signal[index] !== signal[index + 3] &&
    signal[index + 1] !== signal[index + 2] &&
    signal[index + 1] !== signal[index + 3] &&
    signal[index + 2] !== signal[index + 3]
  );
});

const part02 = signal.findIndex((element, index) => {
  const charHash: { [index: string]: boolean } = {};

  for (let i = 0; i < 14; i++) {
    if (charHash[signal[index + i]]) return false;
    charHash[signal[index + i]] = true;
  }

  return true;
});

process.stdout.write(`Part 01: ${part01 + 4}\n`);
process.stdout.write(`Part 02: ${part02 + 14}\n`);

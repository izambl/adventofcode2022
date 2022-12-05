// https://adventofcode.com/2022/day/5
// Day 5: Supply Stacks

import { readInput } from '../../common/index';

const [cratesDefinition, instructions] = readInput('days/day05/input02', '\n\n');
const part01Crates: { [index: number]: string[] } = {};
const part02Crates: { [index: number]: string[] } = {};

cratesDefinition
  .split('\n')
  .slice(0, -1)
  .forEach((line: string) => {
    let readingAt = 1;
    let currentCreate = 1;

    while (line.at(readingAt) !== undefined) {
      if (line.at(readingAt) !== ' ') {
        part01Crates[currentCreate] = part01Crates[currentCreate] ?? [];
        part01Crates[currentCreate].unshift(line.at(readingAt));

        part02Crates[currentCreate] = part02Crates[currentCreate] ?? [];
        part02Crates[currentCreate].unshift(line.at(readingAt));
      }

      readingAt += 4;
      currentCreate += 1;
    }
  });

// CrateMover 9000
instructions.split('\n').forEach((instruction: string) => {
  const [, quantity, , from, , to] = instruction.split(' ');

  for (let i = 1; i <= Number(quantity); i++) {
    const item = part01Crates[Number(from)].pop();
    part01Crates[Number(to)].push(item);
  }
});

// CrateMover 9001
instructions.split('\n').forEach((instruction: string) => {
  const [, quantity, , from, , to] = instruction.split(' ');

  const items = part02Crates[Number(from)].splice(Number(`-${quantity}`));
  part02Crates[Number(to)] = [...part02Crates[Number(to)], ...items];
});

const part01 = Object.keys(part01Crates).reduce((total, crate: string) => `${total}${part01Crates[Number(crate)].at(-1)}`, '');
const part02 = Object.keys(part02Crates).reduce((total, crate: string) => `${total}${part02Crates[Number(crate)].at(-1)}`, '');

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

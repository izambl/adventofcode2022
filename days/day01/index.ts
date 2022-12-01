// https://adventofcode.com/2022/day/1
// Day 1: Calorie Counting

import { readInput } from '../../common/index';

const part01 = readInput('days/day01/input02', '\n\n').map((elf: string) => {
  return elf.split('\n').map(Number);
});

const caloriesPerElf = part01.map((calories) => calories.reduce((acc, calorie) => acc + calorie, 0));

caloriesPerElf.sort((a, b) => b - a);

process.stdout.write(`Part 01: ${caloriesPerElf.at(0)}\n`);
process.stdout.write(`Part 01: ${caloriesPerElf.at(0) + caloriesPerElf.at(1) + caloriesPerElf.at(2)}\n`);

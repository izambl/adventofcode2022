// https://adventofcode.com/2022/day/1
// Day 1: Calorie Counting

import { readInput } from '../../common/index';

const part01 = readInput('days/day01/input02', '\n\n').map((elf: string) => {
  return elf.split('\n').map(Number);
});

function processPart01() {
  const elfsTotalCalories = part01.map((calories) => {
    return calories.reduce((acc, calorie) => acc + calorie, 0);
  });

  elfsTotalCalories.sort((a, b) => b - a);

  return elfsTotalCalories[0];
}

function processPart02() {
  const elfsTotalCalories = part01.map((calories) => {
    return calories.reduce((acc, calorie) => acc + calorie, 0);
  });

  elfsTotalCalories.sort((a, b) => b - a);

  return elfsTotalCalories[0] + elfsTotalCalories[1] + elfsTotalCalories[2];
}

process.stdout.write(`Part 01: ${processPart01()}\n`);
process.stdout.write(`Part 01: ${processPart02()}\n`);

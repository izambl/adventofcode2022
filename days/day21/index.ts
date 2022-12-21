// https://adventofcode.com/2022/day/21
// Day 21: Monkey Math

import { readInput } from '../../common/index';

const stringMonkeys: { [index: string]: number | [string, string, string] } = {};

readInput('days/day21/input02', '\n').forEach((line) => {
  const [monkey, rest] = line.split(': ');
  if (Number(rest)) {
    stringMonkeys[monkey] = Number(rest);
  } else {
    const [left, operator, right] = rest.split(' ');
    stringMonkeys[monkey] = [left, operator, right];
  }
});

function monkeyVal(monkey: string): number {
  if (Array.isArray(stringMonkeys[monkey])) {
    const [left, operator, right] = stringMonkeys[monkey] as [string, string, string];

    switch (operator) {
      case '+':
        return monkeyVal(left) + monkeyVal(right);
      case '-':
        return monkeyVal(left) - monkeyVal(right);
      case '*':
        return monkeyVal(left) * monkeyVal(right);
      case '/':
        return monkeyVal(left) / monkeyVal(right);
    }
  } else {
    return stringMonkeys[monkey] as number;
  }
}
const part01 = monkeyVal('root');
process.stdout.write(`Part 01: ${part01}\n`);

stringMonkeys.humn = 0;
const [left, , right] = stringMonkeys.root as [string, string, string];
let leftVal = monkeyVal(left);
let rightVal = monkeyVal(right);

while (leftVal !== rightVal) {
  if (stringMonkeys.humn % 10_000 === 0) process.stdout.write('.');
  stringMonkeys.humn++;
  leftVal = monkeyVal(left);
  rightVal = monkeyVal(right);
}
const part02 = stringMonkeys.humn;

process.stdout.write(`Part 02: ${part02}\n`);

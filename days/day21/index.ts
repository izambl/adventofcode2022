// https://adventofcode.com/2022/day/21
// Day 21: Monkey Math
import { execSync } from 'child_process';

import { readInput } from '../../common/index';

const macacos: { [index: string]: number | [string, string, string] } = {};

readInput('days/day21/input02', '\n').forEach((line) => {
  const [monkey, rest] = line.split(': ');
  if (Number(rest)) {
    macacos[monkey] = Number(rest);
  } else {
    const [left, operator, right] = rest.split(' ');
    macacos[monkey] = [left, operator, right];
  }
});

function monkeyVal(monkey: string): number {
  if (Array.isArray(macacos[monkey])) {
    const [left, operator, right] = macacos[monkey] as [string, string, string];

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
    return macacos[monkey] as number;
  }
}
const part01 = monkeyVal('root');
process.stdout.write(`Part 01: ${part01}\n`);

// Part 02
function requiresHuman(monkey: string): boolean {
  if (Array.isArray(macacos[monkey])) {
    const [left, , right] = macacos[monkey] as [string, string, string];
    if (left === 'humn' || right === 'humn') return true;

    return requiresHuman(left) || requiresHuman(right);
  } else {
    return false;
  }
}
function valueFromOpp(left: string | number, right: string | number, operator: string, value: string): string {
  if (!Number(left)) {
    // find left
    switch (operator) {
      case '+':
        return `(${value}-${right}.0)`;
      case '-':
        return `(${value}+${right}.0)`;
      case '*':
        return `(${value}/${right}.0)`;
      case '/':
        return `(${value}*${right}.0)`;
    }
  } else {
    // find right
    switch (operator) {
      case '+':
        return `(${value}-${left}.0)`;
      case '-':
        return `(${left}.0-${value})`;
      case '*':
        return `(${value}/${left}.0)`;
      case '/':
        return `(${left}.0/${value})`;
    }
  }
}
function solveFor(monkey: string, eq: string): string {
  const [l, o, r] = macacos[monkey] as [string, string, string];

  if (l === 'humn') {
    return eq.replace(monkey, `(${l}${o}${monkeyVal(r)})`);
  }
  if (r === 'humn') {
    return eq.replace(monkey, `(${monkeyVal(l)}${o}${r})`);
  }
  if (requiresHuman(l)) {
    return solveFor(l, eq.replace(monkey, `(${l}${o}${monkeyVal(r)})`));
  } else {
    return solveFor(r, eq.replace(monkey, `(${monkeyVal(l)}${o}${r})`));
  }
}
function splitEq(eq: string): [string, string, string] {
  const rest = eq.substring(eq.indexOf('('), eq.lastIndexOf(')') + 1);
  const req = eq.replace(rest, '');

  if (rest === '') {
    const [, l, o, r] = eq.match(/(-?\d+)([+-/*])(.+)/);
    return [l, o, r];
  }

  if (/^\d+[/+*-]$/.test(req)) {
    const [, l, o] = req.match(/(-?\d+)([+-/*])/);
    return [l, o, rest];
  } else {
    const [, o, r] = req.match(/([+-/*])(-?\d+)/);
    return [rest, o, r];
  }
}

function solveEquation(eq: string): string {
  const [op, value] = eq.split('=');

  if (op === 'humn') return eq;

  const [l, o, r] = splitEq(op.slice(1, -1));

  const newValue = valueFromOpp(l, r, o, value);
  const newEq = !Number(l) ? `${l}=${newValue}` : `${r}=${newValue}`;
  console.log(`Becomes ${newEq}`);

  return solveEquation(newEq);
}

const [left, , right] = macacos.root as [string, string, string];
const [startMonkey, searchedValue] = requiresHuman(left) ? [left, monkeyVal(right)] : [right, monkeyVal(left)];
const equation = solveFor(startMonkey, `${startMonkey}=${searchedValue}`);

const part02operation = solveEquation(equation).split('=').at(1);

const part02 = execSync(`echo 'print "%.0f" % ${part02operation}' | python`);

process.stdout.write(`Part 02: ${part02}\n`);

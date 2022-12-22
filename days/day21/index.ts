// https://adventofcode.com/2022/day/21
// Day 21: Monkey Math

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
function valueFromOpp(left: string | number, right: string | number, operator: string, value: number): number {
  let result = 0;

  if (!Number(left)) {
    // find left
    switch (operator) {
      case '+':
        result = value - Number(right);
        break;
      case '-':
        result = value + Number(right);
        break;
      case '*':
        result = value / Number(right);
        break;
      case '/':
        result = value * Number(right);
        break;
    }
  } else {
    // find right
    switch (operator) {
      case '+':
        result = value - Number(left);
        break;
      case '-':
        result = value + Number(left);
        break;
      case '*':
        result = value / Number(left);
        break;
      case '/':
        result = Number(left) / value;
        break;
    }
  }

  // console.log('OPERATION', `${left} ${operator} ${right} = ${value}  ==>  ${result}`);

  return result;
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
  return '';
}
function splitEq(eq: string): [string, string, string] {
  const rest = eq.substring(eq.indexOf('('), eq.lastIndexOf(')') + 1);
  const req = eq.replace(rest, '');

  if (rest === '') {
    const [, l, o, r] = eq.match(/(.+)([+-/*])(.+)/);
    return [l, o, r];
  }

  if (/^\d+[/+*-]$/.test(req)) {
    const [, l, o] = req.match(/(\d+)([+-/*])/);
    return [l, o, rest];
  } else {
    const [, o, r] = req.match(/([+-/*])(\d+)/);
    return [rest, o, r];
  }
}

function solveEquation(eq: string): string {
  const [op, value] = eq.split('=');

  if (op === 'humn') return eq;

  const [l, o, r] = splitEq(op.slice(1, -1));

  const newValue = valueFromOpp(l, r, o, Number(value));
  const newEq = !Number(l) ? `${l}=${newValue}` : `${r}=${newValue}`;
  console.log(`Becomes ${newEq}`);

  return solveEquation(newEq);
}

const [left, , right] = macacos.root as [string, string, string];
const [startMonkey, searchedValue] = requiresHuman(left) ? [left, monkeyVal(right)] : [right, monkeyVal(left)];
const equation = solveFor(startMonkey, `${startMonkey}=${searchedValue}`);

const part02 = solveEquation(equation).split('=').at(1);

process.stdout.write(`Part 02: ${part02}\n`);

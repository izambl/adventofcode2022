// https://adventofcode.com/2022/day/11
// Day 11: Monkey in the Middle

import { readInput } from '../../common/index';

const input = readInput('days/day11/input01', '\n\n');

class Monkey {
  name: string;
  items: number[];
  operation: string;
  test: number;
  ifFalse: number;
  ifTrue: number;
  monkeys: Monkey[];
  breath: number;
  itemsInspected: number = 0;

  constructor(
    name: number,
    items: number[],
    operation: string,
    test: number,
    ifFalse: number,
    ifTrue: number,
    monkeys: Monkey[],
    breath: number
  ) {
    this.name = String(name);
    this.items = items;
    this.operation = operation;
    this.test = test;
    this.ifFalse = ifFalse;
    this.ifTrue = ifTrue;
    this.monkeys = monkeys;
    this.breath = breath;
  }

  catchItem(item: number): void {
    process.stdout.write(`Monkey ${this.name} received item ${item}\n`);
    this.items.push(item);
  }

  processTurn(): void {
    process.stdout.write(`\nTurn of monkey ${this.name}\n`);

    while (this.items.length) {
      const item = this.items.shift();
      this.processItem(item);
    }
  }

  processItem(item: number): void {
    process.stdout.write(`  Inspecting item ${item} `);
    let newWorry = this.operate(item);
    process.stdout.write(` =>  ${newWorry}`);
    const nextMonkey = newWorry % this.test === 0 ? this.ifTrue : this.ifFalse;

    process.stdout.write(` ... ${nextMonkey}\n`);
    this.monkeys[nextMonkey].catchItem(newWorry);
    this.itemsInspected++;
    this.operate(item);
  }

  operate(item: number): number {
    const [l, o, r] = this.operation.split(' ');

    const left = l === 'old' ? item : Number(l);
    const right = r === 'old' ? item : Number(r);

    if (o === '*') {
      return Math.floor((left * right) / this.breath);
    } else {
      return Math.floor(left + right / this.breath);
    }
  }
}

const monkeysPart01: Monkey[] = [];
const monkeysPart02: Monkey[] = [];

// Parse input into monkeys
for (const monkeyDefinition of input) {
  const [, items] = monkeyDefinition.match(/items: (.*)/);
  const [, operation] = monkeyDefinition.match(/new = (.*)/);
  const [, test] = monkeyDefinition.match(/divisible by (.*)/);
  const [, ifTrue] = monkeyDefinition.match(/true: throw to monkey (.*)/);
  const [, ifFalse] = monkeyDefinition.match(/false: throw to monkey (.*)/);

  monkeysPart01.push(
    new Monkey(
      monkeysPart01.length,
      items.split(',').map(Number),
      operation,
      Number(test),
      Number(ifFalse),
      Number(ifTrue),
      monkeysPart01,
      3
    )
  );
  monkeysPart02.push(
    new Monkey(
      monkeysPart02.length,
      items.split(',').map(Number),
      operation,
      Number(test),
      Number(ifFalse),
      Number(ifTrue),
      monkeysPart02,
      1
    )
  );
}

// Part01
let part01Rounds = 20;
while (part01Rounds--) {
  for (const monkey of monkeysPart01) {
    monkey.processTurn();
  }
}
const itemsProcessed01 = monkeysPart01.map((monkey: Monkey) => monkey.itemsInspected).sort((a, b) => b - a);
const part01 = itemsProcessed01[0] * itemsProcessed01[1];

// Part01
let rounds = 20;
while (rounds--) {
  for (const monkey of monkeysPart02) {
    monkey.processTurn();
  }
}
const itemsProcessed02 = monkeysPart02.map((monkey: Monkey) => monkey.itemsInspected).sort((a, b) => b - a);
const part02 = itemsProcessed02[0] * itemsProcessed02[1];

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

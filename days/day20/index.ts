// https://adventofcode.com/2022/day/20
// Day 20: Grove Positioning System

import { readInput } from '../../common/index';

type Nodes = {
  prev: Nodes;
  next: Nodes;
  value: number;
};

const nodesMapA: Nodes[] = readInput('days/day20/input02', '\n').map((line) => {
  return {
    value: Number(line),
    prev: null,
    next: null,
  };
});
const nodesMapB: Nodes[] = readInput('days/day20/input02', '\n').map((line) => {
  return {
    value: Number(line),
    prev: null,
    next: null,
  };
});

for (let i = 0; i < nodesMapA.length; i++) {
  const prev = nodesMapA[i - 1] || nodesMapA.at(-1);
  const current = nodesMapA.at(i);
  const next = nodesMapA[i + 1] || nodesMapA.at(0);

  current.prev = prev;
  current.next = next;
}
for (let i = 0; i < nodesMapB.length; i++) {
  const prev = nodesMapB[i - 1] || nodesMapB.at(-1);
  const current = nodesMapB.at(i);
  const next = nodesMapB[i + 1] || nodesMapB.at(0);

  current.prev = prev;
  current.next = next;
}

for (const node of nodesMapA) {
  if (node.value > 0) {
    const rounds = node.value % (nodesMapA.length - 1);
    for (let i = 1; i <= rounds; i++) {
      const next = node.next;

      node.next = next.next;
      next.next = node;
      next.prev = node.prev;
      node.prev = next;

      next.prev.next = next;
      node.next.prev = node;
    }
  } else {
    const rounds = Math.abs(node.value) % (nodesMapA.length - 1);
    for (let i = 1; i <= rounds; i++) {
      const prev = node.prev;

      prev.next = node.next;
      node.next = prev;
      node.prev = prev.prev;
      prev.prev = node;

      node.prev.next = node;
      prev.next.prev = prev;
    }
  }
}

let currentNodeA = nodesMapA.find((node) => node.value === 0);
let at1000A = 0;
let at2000A = 0;
let at3000A = 0;
let roundsA = 0;
while (roundsA++ <= 3000) {
  currentNodeA = currentNodeA.next;
  if (roundsA === 1000) at1000A = currentNodeA.value;
  if (roundsA === 2000) at2000A = currentNodeA.value;
  if (roundsA === 3000) at3000A = currentNodeA.value;
}
const part01 = at1000A + at2000A + at3000A;

// Start part02
for (const node of nodesMapB) node.value = node.value * 811589153;
for (let i = 1; i <= 10; i++) {
  for (const node of nodesMapB) {
    if (node.value > 0) {
      let irounds = node.value % (nodesMapB.length - 1);

      while (irounds--) {
        const next = node.next;

        node.next = next.next;
        next.next = node;
        next.prev = node.prev;
        node.prev = next;

        next.prev.next = next;
        node.next.prev = node;
      }
    } else {
      let irounds = Math.abs(node.value) % (nodesMapB.length - 1);

      while (irounds--) {
        const prev = node.prev;

        prev.next = node.next;
        node.next = prev;
        node.prev = prev.prev;
        prev.prev = node;

        node.prev.next = node;
        prev.next.prev = prev;
      }
    }
  }
}

let currentNodeB = nodesMapB.find((node) => node.value === 0);
let at1000B = 0;
let at2000B = 0;
let at3000B = 0;
let roundsb = 0;
while (roundsb++ <= 3000) {
  currentNodeB = currentNodeB.next;
  if (roundsb === 1000) at1000B = currentNodeB.value;
  if (roundsb === 2000) at2000B = currentNodeB.value;
  if (roundsb === 3000) at3000B = currentNodeB.value;
}

const part02 = at1000B + at2000B + at3000B;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

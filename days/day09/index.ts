// https://adventofcode.com/2022/day/9
// Day 9: Rope Bridge

import { readInput } from '../../common/index';

const input = readInput('days/day09/input02', '\n').map((line) => line.split(' '));

const tailPositionsPart01: { [index: string]: boolean } = { '0-0': true };
const tailPositionsPart02: { [index: string]: boolean } = { '0-0': true };

type Rope = [number, number][];
const ropePart01: Rope = [...Array(2)].map(() => [0, 0]);
const ropePart02: Rope = [...Array(10)].map(() => [0, 0]);

function moveHead(headPos: [number, number], direction: string) {
  switch (direction) {
    case 'R':
      headPos[0]++;
      break;
    case 'L':
      headPos[0]--;
      break;
    case 'U':
      headPos[1]++;
      break;
    case 'D':
      headPos[1]--;
      break;
  }
}
function moveKnot(headPos: [number, number], tailPos: [number, number]) {
  const isDiagonal = tailPos[0] !== headPos[0] && tailPos[1] !== headPos[1];
  const moveX = Math.abs(tailPos[0] - headPos[0]) > 1;
  const moveY = Math.abs(tailPos[1] - headPos[1]) > 1;

  if (!moveX && !moveY) return;

  if (!isDiagonal) {
    if (moveX && tailPos[0] < headPos[0]) tailPos[0]++;
    if (moveX && tailPos[0] > headPos[0]) tailPos[0]--;

    if (moveY && tailPos[1] < headPos[1]) tailPos[1]++;
    if (moveY && tailPos[1] > headPos[1]) tailPos[1]--;
  } else {
    if (tailPos[0] < headPos[0] && tailPos[1] < headPos[1]) {
      tailPos[0]++;
      tailPos[1]++;
    }
    if (tailPos[0] < headPos[0] && tailPos[1] > headPos[1]) {
      tailPos[0]++;
      tailPos[1]--;
    }
    if (tailPos[0] > headPos[0] && tailPos[1] > headPos[1]) {
      tailPos[0]--;
      tailPos[1]--;
    }
    if (tailPos[0] > headPos[0] && tailPos[1] < headPos[1]) {
      tailPos[0]--;
      tailPos[1]++;
    }
  }
}

// Part 01
for (const [direction, steps] of input) {
  const head = ropePart01.at(0);
  const tail = ropePart01.at(-1);

  for (let i = 0; i < Number(steps); i++) {
    moveHead(head, direction);
    for (let knot = 1; knot < ropePart01.length; knot++) {
      moveKnot(ropePart01.at(knot - 1), ropePart01.at(knot));
    }
    tailPositionsPart01[`${tail[0]}-${tail[1]}`] = true;
  }
}

// Part 02
for (const [direction, steps] of input) {
  const head = ropePart02.at(0);
  const tail = ropePart02.at(-1);

  for (let i = 0; i < Number(steps); i++) {
    moveHead(head, direction);
    for (let knot = 1; knot < ropePart02.length; knot++) {
      moveKnot(ropePart02.at(knot - 1), ropePart02.at(knot));
    }
    tailPositionsPart02[`${tail[0]}-${tail[1]}`] = true;
  }
}

const part01 = Object.keys(tailPositionsPart01).length;
const part02 = Object.keys(tailPositionsPart02).length;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

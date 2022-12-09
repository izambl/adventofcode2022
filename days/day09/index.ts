// https://adventofcode.com/2022/day/9
// Day 9: Rope Bridge

import { readInput } from '../../common/index';

const input = readInput('days/day09/input02', '\n').map((line) => line.split(' '));

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

function runRope(instructions: string[][], rope: Rope): number {
  const tailPositions: { [index: string]: boolean } = { '0-0': true };
  const head = rope.at(0);
  const tail = rope.at(-1);

  for (const [direction, steps] of instructions) {
    for (let i = 0; i < Number(steps); i++) {
      moveHead(head, direction);
      for (let knot = 1; knot < rope.length; knot++) {
        moveKnot(rope.at(knot - 1), rope.at(knot));
      }
      tailPositions[`${tail[0]}-${tail[1]}`] = true;
    }
  }

  return Object.keys(tailPositions).length;
}

const part01 = runRope(input, ropePart01);
const part02 = runRope(input, ropePart02);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

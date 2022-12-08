// https://adventofcode.com/2022/day/8
// Day 8: Treetop Tree House

import { readInput } from '../../common/index';

const input = readInput('days/day08/input02', '\n').map((line) => line.split('').map(Number));

let part01 = input.length * 2 + (input[0].length - 2) * 2;
for (let y = 1; y < input.length - 1; y++) {
  for (let x = 1; x < input[y].length - 1; x++) {
    const currentTree = input[y][x];
    let visible = [true, true, true, true];
    let left = x;
    let right = x;
    let up = y;
    let down = y;

    while (visible && input[--up]) {
      if (input[up][x] >= currentTree) visible[0] = false;
    }
    while (visible && input[++down]) {
      if (input[down][x] >= currentTree) visible[1] = false;
    }
    while (visible && input[++right]) {
      if (input[y][right] >= currentTree) visible[2] = false;
    }
    while (visible && input[--left]) {
      if (input[y][left] >= currentTree) visible[3] = false;
    }

    part01 += visible.find((vis) => vis) ? 1 : 0;
  }
}

let part02 = 0;
for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[y].length; x++) {
    const treeScore = [0, 0, 0, 0];
    const initialTree = input[y][x];

    let left = x;
    let right = x;
    let up = y;
    let down = y;

    let currentTree = input[--up]?.[x];
    while (currentTree !== undefined) {
      treeScore[0] += 1;
      if (currentTree >= initialTree) break;

      currentTree = input[--up]?.[x];
    }

    currentTree = input[++down]?.[x];
    while (currentTree !== undefined) {
      treeScore[1] += 1;
      if (currentTree >= initialTree) break;

      currentTree = input[++down]?.[x];
    }

    currentTree = input[y][++right];
    while (currentTree !== undefined) {
      treeScore[2] += 1;
      if (currentTree >= initialTree) break;

      currentTree = input[y][++right];
    }

    currentTree = input[y][--left];
    while (currentTree !== undefined) {
      treeScore[3] += 1;
      if (currentTree >= initialTree) break;

      currentTree = input[y][--left];
    }

    part02 = Math.max(treeScore[0] * treeScore[1] * treeScore[2] * treeScore[3], part02);
  }
}

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

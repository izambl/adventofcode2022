// https://adventofcode.com/2022/day/7
// Day 7: No Space Left On Device

import { readInput } from '../../common/index';

const input = readInput('days/day07/input02');

const TOTAL_SYSTEM = 70000000;
const NEEDED_FREE = 30000000;

const systemTree: any = {};
let currentDir = systemTree;

for (const line of input) {
  if (line.at(0) === '$') {
    if (line.slice(2, 4) === 'cd') {
      const nextDir = line.slice(5);

      if (nextDir === '/') {
        currentDir = systemTree;
      } else if (nextDir === '..') {
        currentDir = currentDir['..'];
      } else {
        currentDir[nextDir]['..'] = currentDir;
        currentDir = currentDir[nextDir];
      }
    }
    continue;
  }
  const [type, name] = line.split(' ');
  if (type === 'dir') {
    currentDir[name] = {};
  } else {
    currentDir[name] = Number(type);
  }
}

const dirSizes: any = {};

let part01 = 0;
function getSize(dir: any, name: string): number {
  dir.size = 0;
  for (const entry in dir) {
    if (entry === 'size' || entry === '..') continue;
    if (typeof dir[entry] === 'number') {
      dir.size += dir[entry];
    } else {
      dir.size += getSize(dir[entry], entry);
    }
  }

  if (dir.size <= 100000) part01 += dir.size;
  dirSizes[name] = dir.size;
  return dir.size;
}

getSize(systemTree, '/');

const needToFree = NEEDED_FREE - (TOTAL_SYSTEM - dirSizes['/']);
const dirs = Object.keys(dirSizes);
dirs.sort((a, b) => dirSizes[a] - dirSizes[b]);

const dirToDelete = dirs.find((dir) => dirSizes[dir] > needToFree);

const part02 = dirSizes[dirToDelete];

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

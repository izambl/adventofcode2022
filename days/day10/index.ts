// https://adventofcode.com/2022/day/10
// Day 10: Cathode-Ray Tube

import { readInput } from '../../common/index';

const input = readInput('days/day10/input02', '\n');

let cycle = 0;
let x = 1;
let signalStrength = 0;
const crt: string[] = [];

function runCycle(times = 1) {
  for (let i = 0; i < times; i++) {
    crt[cycle] = [x - 1, x, x + 1].includes(cycle % 40) ? '#' : ' ';

    cycle += 1;
    if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
      signalStrength += cycle * x;
    }
  }
}

for (const instruction of input) {
  if (instruction === 'noop') {
    runCycle();
  } else {
    const value = Number(instruction.split(' ')[1]);
    runCycle(2);
    x += value;
  }
}

process.stdout.write(`Part 01: ${signalStrength}\n`);

process.stdout.write(`Part 02: ${crt.slice(0, 40).join('')}\n`);
process.stdout.write(`Part 02: ${crt.slice(40, 80).join('')}\n`);
process.stdout.write(`Part 02: ${crt.slice(80, 120).join('')}\n`);
process.stdout.write(`Part 02: ${crt.slice(120, 160).join('')}\n`);
process.stdout.write(`Part 02: ${crt.slice(160, 200).join('')}\n`);
process.stdout.write(`Part 02: ${crt.slice(200, 240).join('')}\n`);

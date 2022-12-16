// https://adventofcode.com/2022/day/16
// Day 16: Proboscidea Volcanium

import { readInput } from '../../common/index';

interface Valve {
  leads: string[];
  name: string;
  rate: number;
  leadsTo: {
    [index: string]: {
      distance: number;
      rate: number;
      path: string[];
    };
  };
}

const valves: { [index: string]: Valve } = {};
const input = readInput('days/day16/input01', '\n');
for (const line of input) {
  const [, valve, rate, leadsTo] = line.match(/Valve (.+) has.*rate=(\d+).*valves? (.+)/);

  valves[valve] = {
    leads: leadsTo.split(', '),
    name: valve,
    rate: Number(rate),
    leadsTo: {},
  };
}

let maxPressure = 0;
let walks = 0;
function walk(
  currentValve: string,
  minute: number = 1,
  openValves: string[] = [],
  releasedPressure: number = 0,
  releasedPerRound: number = 0
) {
  const valve = valves[currentValve];

  releasedPressure += releasedPerRound;

  if (minute >= 30) {
    if (++walks % 1_000_000 === 0) console.log(`current high: ${maxPressure} at ${walks}`);
    maxPressure = Math.max(maxPressure, releasedPressure);
    return;
  }

  // open valve
  if (!openValves.includes(valve.name) && valve.rate > 0) {
    walk(valve.name, minute + 1, [...openValves, valve.name], releasedPressure, releasedPerRound + valve.rate);
  }

  // move to another valve
  for (const nextValveName of valve.leads) {
    walk(nextValveName, minute + 1, [...openValves], releasedPressure, releasedPerRound);
  }
}

walk('AA');

process.stdout.write(`Part 01: ${maxPressure}\n`);
process.stdout.write(`Part 02: ${2}\n`);

// https://adventofcode.com/2022/day/16
// Day 16: Proboscidea Volcanium

import { readInput } from '../../common/index';

interface Valve {
  leads: string[];
  name: string;
  rate: number;
  status: boolean;
  pathTo: {
    [index: string]: {
      distance: number;
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
    pathTo: {},
    status: false,
  };
}

function getShortestPathToValve(from: string, to: string): [number, string[]] {
  const completePaths: [number, string[]][] = [];

  function walk(currentNode: string, targetNode: string, currentPath: string[]) {
    const nextNodes = valves[currentNode].leads;

    if (currentNode === targetNode) {
      completePaths.push([currentPath.length - 1, currentPath]);
      return;
    }

    for (const nextNode of nextNodes) {
      if (currentPath.includes(nextNode)) continue;
      walk(nextNode, targetNode, [...currentPath, nextNode]);
    }

    return;
  }

  walk(from, to, [from]);

  return completePaths.sort(([a], [b]) => a - b).at(0);
}

// Fill paths to valves
for (const v of Object.keys(valves)) {
  const valve = valves[v];
  for (const vv of Object.keys(valves)) {
    if (vv === v) continue;
    const [distance, path] = getShortestPathToValve(v, vv);

    valve.pathTo[vv] = { distance, path };
  }
}

const maxMinutes = 30;
let currentValve = 'AA';
let minutes = maxMinutes;
let pressureFomOpenValves = 0;
let totalPressureReleased = 0;
console.log(`Start in valve ${currentValve}  -- minute ${minutes}`);
while (minutes > 0) {
  totalPressureReleased += pressureFomOpenValves;
  const valve = valves[currentValve];

  const valvePotentials: [string, number][] = Object.keys(valves).map((name) => {
    if (name === currentValve) return [name, 0];

    // If there's no time to reach the valve and open it
    if (minutes - valve.pathTo[name].distance - 1 < 0) return [name, 0];

    // If valve is open, then potential = 1
    const rate = valves[name].status ? 0 : valves[name].rate;
    // Potential is the pressure released during the rest of the minutes afrer getting there
    const valvePotential = (minutes - valve.pathTo[name].distance - 1) * rate;

    return [name, valvePotential];
  });

  const [nextValveToOpen, nextPotential] = valvePotentials.sort(([, a], [, b]) => b - a).at(0);

  if (nextPotential === 0) {
    totalPressureReleased += pressureFomOpenValves * minutes;
    break;
  }

  // Walk to the valve
  minutes -= valve.pathTo[nextValveToOpen].distance;
  currentValve = nextValveToOpen;

  console.log(`Walk from ${valve.name} to ${nextValveToOpen}:${valve.pathTo[nextValveToOpen].distance}  -- minute ${minutes}`);

  // Open the valve
  if (valves[nextValveToOpen].status === false) {
    pressureFomOpenValves += valves[nextValveToOpen].rate;
    valves[nextValveToOpen].status = true;
    minutes--;
    console.log(`Open valve ${nextValveToOpen}  -- minute ${minutes}`);
  }
}

process.stdout.write(`Part 01: ${totalPressureReleased}\n`);
process.stdout.write(`Part 02: ${2}\n`);

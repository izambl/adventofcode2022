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

let relevantValves = ['AA', ...Object.keys(valves).filter((name) => !!valves[name].rate)];

// Fill paths to valves
for (const v of relevantValves) {
  const valve = valves[v];
  for (const vv of relevantValves) {
    if (vv === v) continue;
    const [distance, path] = getShortestPathToValve(v, vv);

    valve.pathTo[vv] = { distance, path };
  }
}

let part01 = 0;
function walkToValves(currentValve: string, minutes: number, pressionReleased: number, pressionFromValves: number, openedValves: string[]) {
  for (const nextValve of relevantValves) {
    if (openedValves.includes(nextValve)) continue;

    const distanceToValve = valves[currentValve].pathTo[nextValve].distance;
    const minutesToOpen = distanceToValve + 1;

    if (minutes - minutesToOpen < 0) continue;

    const newPressionReleased = pressionReleased + pressionFromValves * minutesToOpen;
    const newPressureFromValves = pressionFromValves + valves[nextValve].rate;

    walkToValves(nextValve, minutes - minutesToOpen, newPressionReleased, newPressureFromValves, [...openedValves, nextValve]);
  }

  part01 = Math.max(part01, pressionReleased + pressionFromValves * minutes);
}
walkToValves('AA', 30, 0, 0, ['AA']);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);

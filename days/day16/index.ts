// https://adventofcode.com/2022/day/16
// Day 16: Proboscidea Volcanium

import { readInput } from '../../common/index';

interface Valve {
  leads: string[];
  name: string;
  rate: number;
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

const maxMinute1b = 30;
let part01b = 0;
function walkToValves2(
  a: [string, number, boolean],
  minute: number,
  pressureReleased: number,
  pressionFromValves: number,
  openedValves: string[]
) {
  for (let i = minute; i <= maxMinute1b; i++) {
    // Open Valves
    if (a[1] === i && a[2] === false) {
      openedValves.push(a[0]);
      a[2] = true;
      pressionFromValves += valves[a[0]].rate;
    }
    pressureReleased += pressionFromValves;

    if (i === maxMinute1b) {
      part01b = Math.max(part01b, pressureReleased);
    }

    // Move
    const closedValves = relevantValves.filter((valveName) => !openedValves.includes(valveName));
    if (a[2]) {
      for (const nextValve of closedValves) {
        const opensAt = i + valves[a[0]].pathTo[nextValve].distance + 1;
        if (opensAt >= maxMinute1b) continue;

        walkToValves2([nextValve, opensAt, false], i + 1, pressureReleased, pressionFromValves, [...openedValves]);
      }
    }
  }
}
for (const nextValve of relevantValves) {
  if (nextValve === 'AA') continue;
  const opensAt = 2 + valves.AA.pathTo[nextValve].distance;
  walkToValves2([nextValve, opensAt, false], 1, 0, 0, ['AA']);
}
process.stdout.write(`Part 01b: ${part01b}\n`);

const maxMinute = 26;
let part02 = 0;
function walkToValvesPair(
  a: [string, number, boolean],
  b: [string, number, boolean],
  minute: number,
  pressureReleased: number,
  pressionFromValves: number,
  openedValves: string[]
) {
  for (let i = minute; i <= maxMinute; i++) {
    // Open Valves
    if (a[1] === i && a[2] === false) {
      openedValves.push(a[0]);
      a[2] = true;
      pressionFromValves += valves[a[0]].rate;
    }
    // Open Valves
    if (b[1] === i && b[2] === false) {
      openedValves.push(b[0]);
      b[2] = true;
      pressionFromValves += valves[b[0]].rate;
    }

    pressureReleased += pressionFromValves;

    if (i === maxMinute) {
      part02 = Math.max(part02, pressureReleased);
    }

    // Move
    const closedValves = relevantValves.filter((valveName) => !openedValves.includes(valveName));

    if (a[2] && b[2]) {
      for (const nextValveA of closedValves) {
        const aOpensAt = i + valves[a[0]].pathTo[nextValveA].distance + 1;
        if (aOpensAt >= maxMinute) continue;

        for (const nextValveB of closedValves) {
          if (nextValveA === nextValveB) continue;

          const bOpensAt = i + valves[b[0]].pathTo[nextValveB].distance + 1;
          if (bOpensAt >= maxMinute) continue;

          walkToValvesPair([nextValveA, aOpensAt, false], [nextValveB, bOpensAt, false], i + 1, pressureReleased, pressionFromValves, [
            ...openedValves,
          ]);
        }
      }
    } else if (a[2]) {
      for (const nextValve of closedValves) {
        if (nextValve === b[0]) continue;

        const opensAt = i + valves[a[0]].pathTo[nextValve].distance + 1;
        if (opensAt > maxMinute) continue;

        walkToValvesPair([nextValve, opensAt, false], [...b], i + 1, pressureReleased, pressionFromValves, [...openedValves]);
      }
    } else if (b[2]) {
      for (const nextValve of closedValves) {
        if (nextValve === a[0]) continue;

        const opensAt = i + valves[b[0]].pathTo[nextValve].distance + 1;
        if (opensAt > maxMinute) continue;

        walkToValvesPair([...a], [nextValve, opensAt, false], i + 1, pressureReleased, pressionFromValves, [...openedValves]);
      }
    }
  }
}
for (const nextValveA of relevantValves) {
  if (nextValveA === 'AA') continue;
  for (const nextValveB of relevantValves) {
    if (nextValveB === 'AA') continue;
    if (nextValveB === nextValveA) continue;

    const aOpensAt = 2 + valves.AA.pathTo[nextValveA].distance;
    const bOpensAt = 2 + valves.AA.pathTo[nextValveB].distance;

    walkToValvesPair([nextValveA, aOpensAt, false], [nextValveB, bOpensAt, false], 1, 0, 0, ['AA']);
  }
}
process.stdout.write(`Part 02: ${part02}\n`);

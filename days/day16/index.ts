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
const input = readInput('days/day16/input02', '\n');
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

const maxMinute1b = 30;
let part01b = 0;
function walkToValves2(me: [string, number], minute: number, pressureReleased: number, pressionFromValves: number, openedValves: string[]) {
  const newOpenedValves = [...openedValves];
  let newPressureFromValves = pressionFromValves;

  for (let i = minute; i <= maxMinute1b; i++) {
    pressureReleased += newPressureFromValves;

    // opens and continue round
    if (me[1] === i) {
      newOpenedValves.push(me[0]);
      newPressureFromValves += valves[me[0]].rate;
      continue;
    }
    if (newOpenedValves.includes(me[0])) {
      const closedValves = relevantValves.filter((valveName) => !newOpenedValves.includes(valveName));

      for (const nextValve of closedValves) {
        const opensAt = i + valves[me[0]].pathTo[nextValve].distance;
        walkToValves2([nextValve, opensAt], i + 1, pressureReleased, newPressureFromValves, newOpenedValves);
      }
    }
  }

  part01b = Math.max(part01b, pressureReleased);
}
for (const nextValve of relevantValves) {
  if (nextValve === 'AA') continue;
  const opensAt = 1 + valves.AA.pathTo[nextValve].distance;
  walkToValves2([nextValve, opensAt], 1, 0, 0, ['AA']);
}

const maxMinute = 26;
let part02 = 0;
function walkToValvesPair(
  me: [string, number],
  elephant: [string, number],
  minute: number,
  pressureReleased: number,
  pressionFromValves: number,
  openedValves: string[]
) {
  for (let i = minute; i <= maxMinute; i++) {
    pressureReleased += pressionFromValves;

    if (me[1] === i && elephant[1] === i) {
      const newOpenedValves = [...openedValves, me[0], elephant[0]];
      const newPressureFromValves = pressionFromValves + valves[me[0]].rate + valves[elephant[0]].rate;
      const closedValves = relevantValves.filter((valveName) => !newOpenedValves.includes(valveName));

      for (const nextValveA of closedValves) {
        const openInMinuteA = i + valves[me[0]].pathTo[nextValveA].distance + 1;
        if (openInMinuteA >= maxMinute) continue;

        for (const nextValveB of closedValves) {
          if (nextValveA === nextValveB) continue;

          const openInMinuteB = i + valves[elephant[0]].pathTo[nextValveB].distance + 1;
          if (openInMinuteB >= maxMinute) continue;

          walkToValvesPair(
            [nextValveA, openInMinuteA],
            [nextValveB, openInMinuteB],
            i,
            pressureReleased,
            newPressureFromValves,
            newOpenedValves
          );
        }
      }
    } else if (me[1] === i) {
      const newOpenedValves = [...openedValves, me[0]];
      const newPressureFromValves = pressionFromValves + valves[me[0]].rate;
      const closedValves = relevantValves.filter((valveName) => !newOpenedValves.includes(valveName));

      for (const nextValve of closedValves) {
        if (nextValve === elephant[0]) continue;

        const openInMinute = i + valves[me[0]].pathTo[nextValve].distance + 1;
        if (openInMinute >= maxMinute) continue;

        walkToValvesPair([nextValve, openInMinute], elephant, i, pressureReleased, newPressureFromValves, newOpenedValves);
      }
    } else if (elephant[1] === i) {
      const newOpenedValves = [...openedValves, elephant[0]];
      const newPressureFromValves = pressionFromValves + valves[elephant[0]].rate;
      const closedValves = relevantValves.filter((valveName) => !newOpenedValves.includes(valveName));

      for (const nextValve of closedValves) {
        if (nextValve === me[0]) continue;

        const openInMinute = i + valves[elephant[0]].pathTo[nextValve].distance + 1;
        if (openInMinute >= maxMinute) continue;

        walkToValvesPair(me, [nextValve, openInMinute], i, pressureReleased, newPressureFromValves, newOpenedValves);
      }
    }
  }

  part02 = Math.max(part02, pressureReleased);
}
walkToValvesPair(['AA', 1], ['AA', 1], 1, 0, 0, []);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 01b: ${part01b}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

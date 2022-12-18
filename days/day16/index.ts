// https://adventofcode.com/2022/day/16
// Day 16: Proboscidea Volcanium

import { max } from 'lodash';
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
process.stdout.write(`Part 01: ${part01}\n`);

const maxMinute1b = 30;
let part01b = 0;
function walkToValves2(a: [string, number], minute: number, pressureReleased: number, pressionFromValves: number, openedValves: string[]) {
  const [vName, vMinute] = a;

  const elapsedMinutes = vMinute - minute;
  const currentMinute = vMinute;

  pressureReleased += elapsedMinutes * pressionFromValves + valves[vName].rate;
  pressionFromValves += valves[vName].rate;
  openedValves.push(vName);

  const closedValves = relevantValves.filter((valveName) => !openedValves.includes(valveName));
  for (const nextValve of closedValves) {
    const opensAt = currentMinute + valves[vName].pathTo[nextValve].distance + 1;
    if (opensAt > maxMinute1b) continue;
    walkToValves2([nextValve, opensAt], currentMinute, pressureReleased, pressionFromValves, [...openedValves]);
  }

  pressureReleased += (maxMinute1b - currentMinute) * pressionFromValves;
  part01b = Math.max(part01b, pressureReleased);
}
for (const nextValve of relevantValves) {
  if (nextValve === 'AA') continue;
  const opensAt = 2 + valves.AA.pathTo[nextValve].distance;
  walkToValves2([nextValve, opensAt], 1, 0, 0, ['AA']);
}
process.stdout.write(`Part 01b: ${part01b}\n`);

const maxMinute = 26;
let part02 = 0;
function releasePressure(openedValves: { [index: number]: string[] }): number {
  let totalReleasePressure = 0;
  let releasePressureFromValves = 0;
  let minute = 1;

  while (minute <= maxMinute) {
    totalReleasePressure += releasePressureFromValves;
    if (openedValves[minute]) {
      for (const valve of openedValves[minute]) {
        releasePressureFromValves += valves[valve].rate;
      }
    }
    minute += 1;
  }
  return totalReleasePressure;
}

function walkToValvesPair(a: [string, number], b: [string, number], openedValves: { [index: number]: string[] }) {
  const [[vName, vMinute], [xName, xMinute]] = a[1] < b[1] ? [a, b] : [b, a];

  if (vMinute > maxMinute && xMinute > maxMinute) {
    const released = releasePressure(openedValves);
    const newMax = Math.max(part02, released);

    if (part02 !== newMax) console.log(`New Max: ${newMax}`);

    part02 = newMax;
    return;
  }

  openedValves[vMinute] ??= [];
  openedValves[vMinute].push(vName);

  const openedValvesList = Object.keys(openedValves).reduce((total, minuteKey) => {
    return [...total, ...openedValves[Number(minuteKey)]];
  }, []);
  const closedValves = relevantValves.filter((valveName) => !openedValvesList.includes(valveName));

  if (closedValves.length === 1 && closedValves.at(0) === xName) {
    walkToValvesPair([xName, xMinute], [xName, xMinute], JSON.parse(JSON.stringify(openedValves)));
  } else {
    for (const nextValve of closedValves) {
      if (nextValve === xName) continue;
      const opensAt = vMinute + valves[vName].pathTo[nextValve].distance + 1;
      walkToValvesPair([nextValve, opensAt], [xName, xMinute], JSON.parse(JSON.stringify(openedValves)));
    }
  }

  if (openedValvesList.length === relevantValves.length) {
    const released = releasePressure(openedValves);
    const newMax = Math.max(part02, released);

    if (part02 !== newMax) console.log(`New Max: ${newMax}`);

    part02 = newMax;
  }
}
for (const nextValveA of relevantValves) {
  if (nextValveA === 'AA') continue;
  for (const nextValveB of relevantValves) {
    if (nextValveB === 'AA') continue;
    if (nextValveB === nextValveA) continue;

    const aOpensAt = 1 + valves.AA.pathTo[nextValveA].distance;
    const bOpensAt = 1 + valves.AA.pathTo[nextValveB].distance;

    walkToValvesPair([nextValveA, aOpensAt], [nextValveB, bOpensAt], { 0: ['AA'] });
  }
}
process.stdout.write(`Part 02: ${part02}\n`);

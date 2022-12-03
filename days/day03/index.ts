// https://adventofcode.com/2022/day/3
// Day 3: Rucksack Reorganization

import { readInput } from '../../common/index';

const input = readInput('days/day03/input02', '\n');

function priority(itemType: string): number {
  if (!itemType) return 0;
  if (itemType >= 'a') return itemType.charCodeAt(0) - 96;

  return itemType.charCodeAt(0) - 38;
}

const rucksacks = input.map((inputLine: string) => [inputLine.slice(0, inputLine.length / 2), inputLine.slice(inputLine.length / 2)]);

const repeatedItems = rucksacks.map(([left, right]) => {
  const leftItems: { [index: string]: number } = {};
  const rightItems: { [index: string]: number } = {};

  left.split('').forEach((item) => (leftItems[item] = (leftItems[item] ?? 0) + 1));
  right.split('').forEach((item) => (rightItems[item] = (rightItems[item] ?? 0) + 1));

  for (const item in leftItems) {
    if (rightItems[item]) return item;
  }
});

const groups = rucksacks.reduce(
  (groupsAcc, [left, right]) => {
    const assignedGroup = groupsAcc.find((group) => group.length < 3);
    assignedGroup.push(`${left}${right}`);
    return groupsAcc;
  },
  [...Array(rucksacks.length / 3)].map(() => [])
);

const groupBadges = groups.map(([one, two, three]) => {
  const oneItems: { [index: string]: number } = {};
  const twoItems: { [index: string]: number } = {};
  const threeItems: { [index: string]: number } = {};

  one.split('').forEach((item: string) => (oneItems[item] = (oneItems[item] ?? 0) + 1));
  two.split('').forEach((item: string) => (twoItems[item] = (twoItems[item] ?? 0) + 1));
  three.split('').forEach((item: string) => (threeItems[item] = (threeItems[item] ?? 0) + 1));

  for (const item in oneItems) {
    if (twoItems[item] && threeItems[item]) return item;
  }
});

const part01 = repeatedItems.reduce((total, item) => total + priority(item), 0);
const part02 = groupBadges.reduce((total, item) => total + priority(item), 0);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${part02}\n`);

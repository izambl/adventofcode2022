// https://adventofcode.com/2022/day/19
// Day 19: Not Enough Minerals

import { readInput } from '../../common/index';

enum Resources {
  ore = 'ORE',
  clay = 'CLAY',
  obsidian = 'OBSIDIAN',
  geode = 'GEODE',
}
type ResourceCount = { [index in Resources]?: number };
type BluePrint = {
  [index in Resources]: ResourceCount;
};

const bluePrints: BluePrint[] = readInput('days/day19/input01', '\n').map((blueprint): BluePrint => {
  const [, ...costs] = blueprint.match(/costs (\d+) .+ costs (\d+) .+ costs (\d+) ore and (\d+).+ costs (\d+) ore and (\d+)/);

  return {
    [Resources.ore]: { [Resources.ore]: Number(costs.shift()) },
    [Resources.clay]: { [Resources.ore]: Number(costs.shift()) },
    [Resources.obsidian]: { [Resources.ore]: Number(costs.shift()), [Resources.clay]: Number(costs.shift()) },
    [Resources.geode]: { [Resources.ore]: Number(costs.shift()), [Resources.obsidian]: Number(costs.shift()) },
  };
});

function clone(resourceCount: ResourceCount): ResourceCount {
  return JSON.parse(JSON.stringify(resourceCount));
}

const MAX_MINUTES = 32;
function processBluePrint(bp: BluePrint, num: number): number {
  const initialRobots: ResourceCount = {
    [Resources.ore]: 1,
    [Resources.clay]: 0,
    [Resources.obsidian]: 0,
    [Resources.geode]: 0,
  };
  const initialResources: ResourceCount = {
    [Resources.ore]: 0,
    [Resources.clay]: 0,
    [Resources.obsidian]: 0,
    [Resources.geode]: 0,
  };
  const maxOre = Object.keys(bp).reduce((tot: number, res: Resources) => Math.max(tot, bp[res].ORE ?? 0), 0);
  const maxClay = Object.keys(bp).reduce((tot: number, res: Resources) => Math.max(tot, bp[res].CLAY ?? 0), 0);
  const maxObsidian = Object.keys(bp).reduce((tot: number, res: Resources) => Math.max(tot, bp[res].OBSIDIAN ?? 0), 0);
  const maxGeode = Infinity;

  let mg = 0;
  function processDay(currentMinute: number, robots: ResourceCount, resources: ResourceCount, log: string): number {
    let testGeode = resources.GEODE;
    let testRobot = robots.GEODE;
    for (let m = currentMinute; m <= MAX_MINUTES + 1; m++) testGeode += testRobot++;
    if (testGeode < mg) return 0;

    for (let minute = currentMinute; minute <= MAX_MINUTES; minute++) {
      const multiverses: [ResourceCount, ResourceCount, string][] = [];

      const canBuild = {
        GEODE: robots.GEODE !== maxGeode && Object.keys(bp.GEODE).every((resource: Resources) => resources[resource] >= bp.GEODE[resource]),
        ORE: robots.ORE !== maxOre && Object.keys(bp.ORE).every((res: Resources) => resources[res] >= bp.ORE[res]),
        CLAY: robots.CLAY !== maxClay && Object.keys(bp.CLAY).every((res: Resources) => resources[res] >= bp.CLAY[res]),
        OBSIDIAN: robots.OBSIDIAN !== maxObsidian && Object.keys(bp.OBSIDIAN).every((res: Resources) => resources[res] >= bp.OBSIDIAN[res]),
      };

      // Gather resources
      for (const resource of Object.values(Resources)) resources[resource] += robots[resource];

      if (currentMinute === MAX_MINUTES) break;

      if (canBuild.GEODE) {
        for (const resource of Object.keys(bp.GEODE) as Array<Resources>) resources[resource] -= bp.GEODE[resource];
        robots.GEODE += 1;
        log += `${minute}:G|`;
        continue;
      }

      if (canBuild.CLAY) {
        const newResources = clone(resources);
        const newRobots = clone(robots);
        const newLog = `${log}${minute}:C|`;

        for (const resource of Object.keys(bp.CLAY) as Array<Resources>) newResources[resource] -= bp.CLAY[resource];
        newRobots.CLAY += 1;

        multiverses.push([newRobots, newResources, newLog]);
      }
      if (canBuild.OBSIDIAN) {
        const newResources = clone(resources);
        const newRobots = clone(robots);
        const newLog = `${log}${minute}:B|`;

        for (const resource of Object.keys(bp.OBSIDIAN) as Array<Resources>) newResources[resource] -= bp.OBSIDIAN[resource];
        newRobots.OBSIDIAN += 1;

        multiverses.push([newRobots, newResources, newLog]);
      }
      if (canBuild.ORE) {
        const newResources = clone(resources);
        const newRobots = clone(robots);
        const newLog = `${log}${minute}:O|`;

        for (const resource of Object.keys(bp.ORE) as Array<Resources>) newResources[resource] -= bp.ORE[resource];
        newRobots.ORE += 1;

        multiverses.push([newRobots, newResources, newLog]);
      }

      if (!multiverses.length) {
        continue;
      }

      const newLog = `${log}${minute}:P|`;
      multiverses.push([robots, resources, newLog]);
      multiverses.sort(() => 0.5 - Math.random());

      return Math.max(...multiverses.map(([bots, res, l]) => processDay(minute + 1, bots, res, l)));
    }

    if (resources.GEODE > mg) {
      mg = resources.GEODE;
      console.log(`BluePrint ${`0${num + 1}`.slice(-2)} New High: ${mg}`, log);
    }

    return resources.GEODE;
  }

  const result = processDay(1, initialRobots, initialResources, '');
  console.log(`Blueprint ${`0${num + 1}`.slice(-2)} found`, result);

  return result;
}

const part01 = bluePrints
  .slice(0, 3)
  .map((bp, index) => processBluePrint(bp, index))
  .reduce((total, geodes) => total * geodes, 1);

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);

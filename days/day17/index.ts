// https://adventofcode.com/2022/day/17
// Day 17: Pyroclastic Flow

import { readInput } from '../../common/index';

const input = readInput('days/day17/input02', '\n')[0].split('');

type Point = [number, number];
type RockShape = {
  width: number;
  height: number;
  points: Point[];
};

const rockShapes: RockShape[] = [
  {
    width: 4,
    height: 1,
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },
  {
    width: 3,
    height: 3,
    points: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
  },
  {
    width: 3,
    height: 3,
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  {
    width: 1,
    height: 4,
    points: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  {
    width: 2,
    height: 2,
    points: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  },
];

let nextShape = 0;
function getShape(): RockShape {
  const shape = rockShapes[nextShape];

  nextShape = rockShapes[nextShape + 1] ? nextShape + 1 : 0;

  return shape;
}

let nextJet = 0;
function getJet() {
  const jet = input[nextJet];

  nextJet = input[nextJet + 1] ? nextJet + 1 : 0;

  return jet === '<' ? -1 : 1;
}

function growMap(height: number, map: boolean[][]) {
  let floors = height - map.length;
  while (floors-- > 0) {
    map.push([true, false, false, false, false, false, false, false, true]);
  }
}

function printMap(map: boolean[][]) {
  console.clear();

  for (let i = map.length - 1; i >= 0; i--) {
    const line = map[i].map((point: boolean) => (point ? '#' : '.')).join('');

    console.log(line);
  }
}

class Rock {
  private shape: RockShape;
  private x: number;
  private y: number;
  private map: boolean[][];

  constructor(x: number, y: number, map: boolean[][]) {
    this.shape = getShape();
    this.x = x;
    this.y = y;
    this.map = map;
  }

  get height() {
    return this.shape.height;
  }

  get width() {
    return this.shape.width;
  }

  get topHeigth() {
    return this.y + this.shape.height - 1;
  }

  private isInCollision(x: number = this.x, y: number = this.y): boolean {
    return this.shape.points.some(([shapeX, shapeY]) => this.map[shapeY + y][shapeX + x] === true);
  }

  private applyInitialJet() {
    const jet = getJet();

    if (this.x + jet > 0 && this.x + jet <= 8 - this.shape.width) this.x += jet;
    this.y -= 1;
  }

  private applyJet() {
    const jet = getJet();

    this.x = this.isInCollision(this.x + jet) ? this.x : this.x + jet;
  }

  private goDown(): boolean {
    if (this.isInCollision(this.x, this.y - 1)) {
      return false;
    }
    this.y -= 1;
    return true;
  }

  private setInMap() {
    for (const [shapeX, shapeY] of this.shape.points) {
      this.map[this.y + shapeY][this.x + shapeX] = true;
    }
  }

  run() {
    let settled = false;
    this.applyInitialJet();
    this.applyInitialJet();
    this.applyInitialJet();

    while (!settled) {
      this.applyJet();
      settled = !this.goDown();
    }

    this.setInMap();
  }
}

const patterfinding = false;
const patterns: { lastChanges: number[]; lastTop: number }[] = [];

const pattern01 = [35, 53];
const pattern02 = [1745, 2785];

let rounds = 1000000000000;
const pattern = pattern02;

let adjustedRounds = pattern[0] + ((rounds - pattern[0]) % pattern[0]);

const map = [[true, true, true, true, true, true, true, true, true]];
let topHeight = 0;
while (adjustedRounds--) {
  const rock = new Rock(3, topHeight + 4, map);
  growMap(rock.topHeigth + 1, map);

  rock.run();

  topHeight = Math.max(topHeight, rock.topHeigth);

  if (!patterfinding) continue;
  for (let i = 1; i <= 50; i++) {
    if (rounds % i === 0) {
      patterns[i] = patterns[i] || { lastTop: 0, lastChanges: [] };

      if (patterns[i].lastTop !== 0) {
        const change = topHeight - patterns[i].lastTop;
        patterns[i].lastChanges.push(change);

        if (patterns[i].lastChanges.length > 15) {
          if (patterns[i].lastChanges.every((value) => value === change)) {
            console.log('WUREKA', change, i, rounds);
          }

          patterns[i].lastChanges.shift();
        }
      }
      patterns[i].lastTop = topHeight;
    }
  }
}

process.stdout.write(`Part 01: ${topHeight + pattern[1] * Math.floor((rounds - pattern[0]) / pattern[0])}\n`);

// Part02 pattern :   53 - 35    Every   35 rounds it increases 53
// Part02 pattern : 2785 - 1745  Every 1745 rounds it increases 2785

// Calvulo primeras 35, anoto Top Height
// 2022 - 35 = restantes

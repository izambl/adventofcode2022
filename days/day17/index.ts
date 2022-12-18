// https://adventofcode.com/2022/day/17
// Day 17: Pyroclastic Flow

import { readInput } from '../../common/index';

const input = readInput('days/day17/input01', '\n')[0].split('');

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

let currentShape = 0;
function getShape(): RockShape {
  if (!rockShapes[currentShape]) {
    currentShape = 0;
  }

  return rockShapes[currentShape++];
}

let currentJet = 0;
function getJet() {
  if (!input[currentJet]) {
    currentJet = 0;
  }

  return input[currentJet++] === '<' ? -1 : 1;
}

function growMap(height: number, map: boolean[][]) {
  let floors = height - map.length;
  while (floors-- > 0) {
    map.push([true, false, false, false, false, false, false, false, true]);
  }
}

function printMap(map: boolean[][]) {
  const mapToPrint = JSON.parse(JSON.stringify(map));

  console.clear();

  let row = mapToPrint.pop();
  while (row) {
    console.log(`${row.map((point: boolean) => (point ? '#' : '.')).join('')}`);
    row = mapToPrint.pop();
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
    while (!settled) {
      this.applyJet();
      settled = !this.goDown();
    }

    this.setInMap();
  }
}

let rounds = 2022;
const map = [[true, true, true, true, true, true, true, true, true]];
let topHeight = 0;
while (rounds--) {
  const rock = new Rock(3, topHeight + 4, map);
  growMap(rock.topHeigth + 1, map);

  rock.run();

  topHeight = Math.max(topHeight, rock.topHeigth);
}

printMap(map);

process.stdout.write(`Part 01: ${topHeight}\n`);
process.stdout.write(`Part 02: ${2}\n`);

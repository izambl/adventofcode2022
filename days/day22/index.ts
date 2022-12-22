// https://adventofcode.com/2022/day/22
// Day 22: Monkey Map

import { readInput } from '../../common/index';

enum TileType {
  OPEN = 1,
  WALL = 2,
}

enum Direction {
  UP = 3,
  RIGHT = 0,
  DOWN = 1,
  LEFT = 2,
}

class Tile {
  type: TileType;
  up: Tile;
  right: Tile;
  down: Tile;
  left: Tile;
  position: { x: number; y: number };

  constructor(x: number, y: number) {
    this.position = { x, y };
  }
}

const [mapDefinition, pathDefinition] = readInput('days/day22/input02', '\n\n');
const path = pathDefinition.match(/\d+|\D+/g);
const map = mapDefinition.split('\n').map((line) => line.split(''));
const tilesMap: { [index: string]: Tile } = {};

// Create tiles
let initialTile: Tile;
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === ' ') continue;

    const key = `${x}|${y}`;
    const tile = new Tile(x, y);
    tile.type = map[y][x] === '.' ? TileType.OPEN : TileType.WALL;
    tilesMap[key] = tile;
    if (!initialTile) initialTile = tile;
  }
}
// Add Neighbors to tiles
for (const tileKey in tilesMap) {
  const tile = tilesMap[tileKey];

  tile.right = tilesMap[`${tile.position.x + 1}|${tile.position.y}`];
  tile.left = tilesMap[`${tile.position.x - 1}|${tile.position.y}`];
  tile.up = tilesMap[`${tile.position.x}|${tile.position.y - 1}`];
  tile.down = tilesMap[`${tile.position.x}|${tile.position.y + 1}`];

  if (!tile.right) {
    let nextXPos = tile.position.x - 1;
    while (tilesMap[`${nextXPos - 1}|${tile.position.y}`]) nextXPos = nextXPos - 1;
    tile.right = tilesMap[`${nextXPos}|${tile.position.y}`];
  }
  if (!tile.left) {
    let nextXPos = tile.position.x + 1;
    while (tilesMap[`${nextXPos + 1}|${tile.position.y}`]) nextXPos = nextXPos + 1;
    tile.left = tilesMap[`${nextXPos}|${tile.position.y}`];
  }
  if (!tile.up) {
    let nextYPos = tile.position.y + 1;
    while (tilesMap[`${tile.position.x}|${nextYPos + 1}`]) nextYPos = nextYPos + 1;
    tile.up = tilesMap[`${tile.position.x}|${nextYPos}`];
  }
  if (!tile.down) {
    let nextYPos = tile.position.y - 1;
    while (tilesMap[`${tile.position.x}|${nextYPos - 1}`]) nextYPos = nextYPos - 1;
    tile.down = tilesMap[`${tile.position.x}|${nextYPos}`];
  }
}

const directionChange: { [index: string]: { [index: string]: Direction } } = {
  [Direction.DOWN]: { R: Direction.LEFT, L: Direction.RIGHT },
  [Direction.UP]: { R: Direction.RIGHT, L: Direction.LEFT },
  [Direction.RIGHT]: { R: Direction.DOWN, L: Direction.UP },
  [Direction.LEFT]: { R: Direction.UP, L: Direction.DOWN },
};

// Part 01 execution
let direction = Direction.RIGHT;
let me = initialTile;
for (const step of path) {
  if (Number.isNaN(Number(step))) {
    direction = directionChange[direction][step];
  } else {
    let rounds = Number(step);
    while (rounds--) {
      switch (direction) {
        case Direction.RIGHT:
          if (me.right.type === TileType.WALL) break;
          me = me.right;
          break;
        case Direction.LEFT:
          if (me.left.type === TileType.WALL) break;
          me = me.left;
          break;
        case Direction.UP:
          if (me.up.type === TileType.WALL) break;
          me = me.up;
          break;
        case Direction.DOWN:
          if (me.down.type === TileType.WALL) break;
          me = me.down;
          break;
      }
    }
  }
}

const part01 = 1000 * (me.position.y + 1) + 4 * (me.position.x + 1) + direction;

process.stdout.write(`Part 01: ${part01}\n`);
process.stdout.write(`Part 02: ${2}\n`);

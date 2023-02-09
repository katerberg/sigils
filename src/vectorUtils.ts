import * as paper from 'paper';

export function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomPoint(minX = -3, maxX = 3, minY = -3, maxY = 3): paper.Point {
  return new paper.Point(getRandomNumber(minX, maxX), getRandomNumber(minY, maxY));
}

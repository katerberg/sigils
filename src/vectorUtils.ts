import * as paper from 'paper';
import {Point} from './lib/dollar';

type MinMax = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomPoint(minX = -3, maxX = 3, minY = -3, maxY = 3): paper.Point {
  return new paper.Point(getRandomNumber(minX, maxX), getRandomNumber(minY, maxY));
}

export function getMinMax(points: Point[]): MinMax {
  const {width, height} = globalThis.gameElement.getBoundingClientRect();
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  points.forEach((p) => {
    if (p.X > maxX) {
      maxX = p.X;
    }
    if (p.X < minX) {
      minX = p.X;
    }
    if (p.Y > maxY) {
      maxY = p.Y;
    }
    if (p.Y < minY) {
      minY = p.Y;
    }
  });

  return {minX, maxX, minY, maxY};
}

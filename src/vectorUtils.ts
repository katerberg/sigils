import * as paper from 'paper';

function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomVector(): paper.Point {
  return new paper.Point(getRandomNumber(-1, 1), getRandomNumber(-1, 1));
}

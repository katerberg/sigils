import * as paper from 'paper';
import {Point} from '../lib/dollar';
import {getMinMax} from '../vectorUtils';
import {Sigil} from './sigils/Sigil';

export class SigilPreview {
  points: Point[];

  drawn: paper.Path | undefined;

  constructor(sigil: Sigil) {
    this.points = sigil.points;
  }

  drawPoints(): paper.Path {
    const {width, height} = globalThis.gameElement.getBoundingClientRect();
    const verticalPadding = height * 0.01;
    const horizontalPadding = width * 0.92;

    const {minX, minY, maxX} = getMinMax(this.points);

    const rightMostPoint = width * 0.05;
    const leftOffset = Math.abs(minX);
    const topOffset = Math.abs(minY);
    const multiplier = rightMostPoint / (maxX + leftOffset);

    const drawn = new paper.Path();
    drawn.strokeColor = new paper.Color(0, 0, 0, 0.2);
    drawn.strokeWidth = 4;

    console.log(leftOffset, horizontalPadding);
    console.log(this.points);
    this.points.forEach(({X, Y}) => {
      drawn.add({
        x: (X + leftOffset) * multiplier + horizontalPadding,
        y: (Y + topOffset) * multiplier + verticalPadding,
      });
      console.log((X + leftOffset) * multiplier + horizontalPadding);
    });
    drawn.closed = true;

    return drawn;
  }

  die(): void {
    this.drawn?.remove();
  }

  moveTo(position: number): void {}

  step(position: number): void {
    if (!this.drawn) {
      this.drawn = this.drawPoints();
    }
    this.moveTo(position);
  }
}

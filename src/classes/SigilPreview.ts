import * as paper from 'paper';
import {getMinMax} from '../vectorUtils';
import {Sigil} from './sigils/Sigil';

export class SigilPreview {
  sigil: Sigil;

  drawn: paper.Path | undefined;

  getXStartPosition: (x: number) => number;

  startingXPadding: number;

  constructor(sigil: Sigil) {
    this.sigil = sigil;

    const {width} = globalThis.gameElement.getBoundingClientRect();
    this.startingXPadding = width * 0.92;

    this.getXStartPosition = (x: number): number => {
      const {minX, maxX} = getMinMax(this.sigil.points);

      const sigilWidth = width * 0.05;
      const leftOffset = Math.abs(minX);
      const multiplier = sigilWidth / (maxX + leftOffset);
      return (x + leftOffset) * multiplier;
    };
  }

  drawPoints(): paper.Path {
    const {width, height} = globalThis.gameElement.getBoundingClientRect();
    const verticalPadding = height * 0.01;
    const horizontalPadding = width * 0.92;

    const {minX, minY, maxX} = getMinMax(this.sigil.points);

    const sigilWidth = width * 0.05;
    const leftOffset = Math.abs(minX);
    const topOffset = Math.abs(minY);
    const multiplier = sigilWidth / (maxX + leftOffset);

    const drawn = new paper.Path();
    drawn.strokeColor = new paper.Color(0, 0, 0, 0.2);
    drawn.strokeWidth = 4;

    this.sigil.points.forEach(({X, Y}) => {
      drawn.add({
        x: this.getXStartPosition(X) + horizontalPadding,
        y: (Y + topOffset) * multiplier + verticalPadding,
      });
    });
    drawn.closed = true;

    return drawn;
  }

  die(): void {
    this.drawn?.remove();
  }

  moveTo(position: number): void {
    if (!this.drawn) {
      this.drawn = this.drawPoints();
    }
    this.sigil.points.forEach(({X}, i) => {
      if (this.drawn) {
        this.drawn.segments[i].point.x =
          this.getXStartPosition(X) + this.startingXPadding - position * this.startingXPadding;
      }
    });
    this.drawn?.segments.forEach((segment) => segment);
  }
}

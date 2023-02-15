import * as paper from 'paper';
import {getMinMax, getRandomNumber, getSigilPreviewYOffset} from '../vectorUtils';
import {Sigil} from './sigils/Sigil';

export class SigilPreview {
  sigil: Sigil;

  drawn: paper.Path | undefined;

  getXStartPosition: (x: number) => number;

  startingXPadding: number;

  startingYPadding: number;

  yRotation: number;

  constructor(sigil: Sigil) {
    this.sigil = sigil;

    const {height, width} = globalThis.gameElement.getBoundingClientRect();
    this.startingXPadding = width * 0.92;
    this.startingYPadding = height * 0.04;

    this.yRotation = getRandomNumber(0, 2);

    this.getXStartPosition = (x: number): number => {
      const {minX, maxX} = getMinMax(this.sigil.points);

      const sigilWidth = width * 0.05;
      const leftOffset = Math.abs(minX);
      const multiplier = sigilWidth / (maxX + leftOffset);
      return (x + leftOffset) * multiplier;
    };
  }

  drawPoints(): paper.Path {
    const {width} = globalThis.gameElement.getBoundingClientRect();
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
        y: (Y + topOffset) * multiplier + this.startingYPadding,
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
    const previousYRotation = this.yRotation;
    this.yRotation = (this.yRotation + getRandomNumber(0.003, 0.007)) % 2;
    this.sigil.points.forEach(({X, Y}, i) => {
      if (this.drawn) {
        this.drawn.segments[i].point.x =
          this.getXStartPosition(X) + this.startingXPadding - position * this.startingXPadding;
        this.drawn.segments[i].point.y =
          this.drawn.segments[i].point.y -
          getSigilPreviewYOffset(previousYRotation) +
          getSigilPreviewYOffset(this.yRotation);
      }
    });
    this.drawn?.segments.forEach((segment) => segment);
  }
}

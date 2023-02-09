import * as paper from 'paper';
import {getRandomSparkColor, TRANSPARENT} from '../colors';
import {getRandomPoint} from '../vectorUtils';

export class Spark {
  circle: paper.Shape;

  vector: paper.Point;

  constructor(point: paper.Point) {
    this.circle = new paper.Shape.Circle(point, 10);
    const gradient = new paper.Gradient();
    gradient.radial = true;
    gradient.stops = [new paper.GradientStop(getRandomSparkColor(), 0.05), new paper.GradientStop(TRANSPARENT, 0.7)];
    this.circle.fillColor = new paper.Color(gradient, this.circle.bounds.center, this.circle.bounds.rightCenter);

    this.vector = getRandomPoint(-6, 6, -6, 6);
  }

  public step(fade = 0.06): void {
    this.circle.opacity -= fade;
    this.circle.position.x += this.vector.x;
    this.circle.position.y += this.vector.y;
    if (Math.abs(this.vector.x) > 0.5 || Math.abs(this.vector.y) > 0.5) {
      this.vector.x *= 0.9;
      this.vector.y *= 0.9;
    }
  }
}

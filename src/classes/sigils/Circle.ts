import {Point} from '../Point';
import {Sigil} from './Sigil';

export class Circle extends Sigil {
  constructor() {
    super();

    const radius = 10;
    this.points = [];
    for (let angle = 0; angle < 2; angle += 0.05) {
      const piAngle = angle * Math.PI;
      this.points.push(new Point(radius * Math.cos(piAngle), radius * Math.sin(piAngle), 1));
    }

    this.recognizer.AddGesture('circle', this.points);
  }
}

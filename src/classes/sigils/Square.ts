import {Point} from '../Point';
import {Sigil} from './Sigil';

export class Square extends Sigil {
  constructor() {
    super();
    [new Point(0, 0, 1), new Point(0, 80, 1), new Point(80, 80, 1), new Point(80, 0, 1), new Point(0, 0, 1)].forEach(
      (p) => this.points.push(p),
    );

    this.recognizer.AddGesture('square', this.points);
  }
}

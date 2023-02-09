import {Point} from '../Point';
import {Sigil} from './Sigil';

export class Triangle extends Sigil {
  constructor() {
    super();
    this.points = [new Point(0, 0, 1), new Point(80, 0, 1), new Point(40, 69, 1), new Point(0, 0, 1)];

    this.recognizer.AddGesture('triangle', this.points);
  }
}

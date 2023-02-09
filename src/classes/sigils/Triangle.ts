import {Point} from '../Point';
import {Sigil} from './Sigil';

export class Triangle extends Sigil {
  constructor() {
    super();
    this.points = [new Point(7, 0, 1), new Point(87, 0, 1), new Point(47, 69, 1), new Point(7, 0, 1)];

    this.recognizer.AddGesture('triangle', this.points);
  }
}

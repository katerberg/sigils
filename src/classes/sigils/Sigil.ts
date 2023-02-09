import DollarRecognizer, {Result} from '../../lib/dollar';
import {Point} from '../Point';

export abstract class Sigil {
  protected recognizer: DollarRecognizer;

  points: Point[];

  constructor() {
    this.points = [];
    this.recognizer = new DollarRecognizer();
  }

  recognize(points: Point[]): Result {
    return this.recognizer.Recognize(points, true);
  }
}

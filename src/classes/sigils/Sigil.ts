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
    if (points?.length > 1) {
      return this.recognizer.Recognize(points, true);
    }
    return {Name: 'unknown', Score: 0, Time: 0};
  }
}

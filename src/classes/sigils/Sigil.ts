import DollarRecognizer, {Result} from '../../lib/dollar';
import {DAMAGE_THRESHOLD} from '../../logic';
import {Point} from '../Point';

export abstract class Sigil {
  protected recognizer: DollarRecognizer;

  hp: number;

  points: Point[];

  constructor() {
    this.points = [];
    this.hp = 0.3;
    this.recognizer = new DollarRecognizer();
  }

  recognize(points: Point[]): Result {
    if (points?.length > 1) {
      return this.recognizer.Recognize(points, true);
    }
    return {Name: 'unknown', Score: 0, Time: 0};
  }

  handleDrawResult(result: number): number {
    if (result > DAMAGE_THRESHOLD.ok) {
      this.hp -= result - DAMAGE_THRESHOLD.ok;
    }
    return this.hp;
  }
}

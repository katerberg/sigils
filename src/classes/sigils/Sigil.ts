import {killSigil} from '../..';
import DollarRecognizer, {Result} from '../../lib/dollar';
import {DAMAGE_THRESHOLD} from '../../logic';
import {OnFrameEvent} from '../../vectorUtils';
import {Point} from '../Point';
import {SigilPreview} from '../SigilPreview';

export abstract class Sigil {
  protected recognizer: DollarRecognizer;

  // A value which indicates how close to arrival the sigil is. Zero is on screen, One is scoring.
  position: number;

  preview: SigilPreview;

  hp: number;

  points: Point[];

  constructor() {
    this.position = 0;
    this.points = [];
    this.hp = 0.3;
    this.recognizer = new DollarRecognizer();
    this.preview = new SigilPreview(this);
  }

  die(): void {
    this.preview.die();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  step(event: OnFrameEvent): void {
    this.position += 0.001;
    // this.position += 0.001;
    if (this.position > 0 && this.position <= 1) {
      this.preview.moveTo(this.position);
    }
    if (this.position >= 1) {
      killSigil(this);
    }
  }
}

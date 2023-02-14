import * as paper from 'paper';
import {BLACK} from '../colors';
import {getMessageText} from '../logic';
import {getRandomSigil} from '../sigilUtils';
import {getRandomPoint} from '../vectorUtils';
import {Sigil} from './sigils/Sigil';
import {Spark} from './Spark';

export class SigilQueue {
  queue: Sigil[];

  celebrationSparks: Spark[];

  guessText: paper.PointText;

  constructor() {
    this.queue = [];
    this.celebrationSparks = [];
    this.guessText = new paper.PointText({x: 0, y: 0});
    for (let i = 0; i < 5; i++) {
      this.queue.push(getRandomSigil());
      this.queue[i].position = -1 * i;
    }
  }

  get currentSigil(): Sigil {
    return this.queue[0];
  }

  private getDollarRecognized(path: paper.Path): number {
    const recognizeResult = this.currentSigil.recognize(
      path.segments.map((s) => ({X: s.point.x, Y: s.point.y, ID: 1, Angle: 0.0})),
    );
    this.guessText.remove();
    this.guessText = new paper.PointText({
      point: paper.view.center.transform(new paper.Matrix().translate(0, -230)),
      justification: 'center',
      fontSize: 20,
    });
    this.guessText.fillColor = BLACK;
    this.guessText.content = getMessageText(recognizeResult.Score);
    if (recognizeResult.Score > 0.7) {
      const {width} = globalThis.gameElement.getBoundingClientRect();
      Array.from(Array(100)).forEach(() =>
        this.celebrationSparks.push(
          new Spark(
            getRandomPoint(
              this.guessText.point.x - width / 3,
              this.guessText.point.x + width / 3,
              this.guessText.point.y,
              this.guessText.point.y,
            ),
          ),
        ),
      );
    }
    return recognizeResult.Score;
  }

  handleDrawnLine(drawnLine: paper.Path): void {
    const result = this.getDollarRecognized(drawnLine);
    if (this.currentSigil.handleDrawResult(result) < 0) {
      this.queue.shift()?.die();
    }
  }

  onFrame(): void {
    if (this.guessText?.opacity > 0) {
      this.guessText.opacity *= 0.9;
      if (typeof this.guessText.fontSize === 'number') {
        this.guessText.fontSize++;
        this.guessText.position.y++;
      }
      if (this.guessText.opacity <= 0.05) {
        this.guessText.remove();
      }
    }
    if (this.celebrationSparks.length) {
      if (this.celebrationSparks[0].circle.opacity < 0) {
        this.celebrationSparks.shift()?.circle?.remove();
      }
      this.celebrationSparks.forEach((spark) => {
        spark.step(0.03);
      });
    }

    if (this.queue.length) {
      this.queue.forEach((sigil, i) => {
        if (i === 1) {
          sigil.step();
        }
      });
    }
  }
}

import './index.scss';
import * as paper from 'paper';
import {Circle} from './classes/sigils/Circle';
import {Sigil} from './classes/sigils/Sigil';
import {Square} from './classes/sigils/Square';
import {Triangle} from './classes/sigils/Triangle';
import {Spark} from './classes/Spark';
import {BLACK, TEAL, TURQUOISE} from './colors';
import {Point} from './lib/dollar';
import {getMessageText} from './logic';
import {getRandomPoint} from './vectorUtils';

type OnFrameEvent = {
  delta: number;
  time: number;
  count: number;
};

screen.orientation?.lock?.('portrait');

let currentSigil: Sigil;
let drawnSigil: paper.Path;
let guessText: paper.PointText;
let linePath: paper.Path;
let leadingSparks: Spark[];
const celebrationSparks: Spark[] = [];
let isDrawing = false;

function initCanvasSize(canvas: HTMLCanvasElement): void {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  canvas.width = 1000; //horizontal resolution (?) - increase for better looking text
  canvas.height = 1778; //vertical resolution (?) - increase for better looking text
  canvas.style.width = `${width}`; //actual width of canvas
  canvas.style.height = `${height}`; //actual height of canvas
  globalThis.gameElement = canvas;
}

function getDollarRecognized(path: paper.Path): void {
  const recognizeResult = currentSigil.recognize(
    path.segments.map((s) => ({X: s.point.x, Y: s.point.y, ID: 1, Angle: 0.0})),
  );
  guessText?.remove();
  guessText = new paper.PointText({
    point: paper.view.center.transform(new paper.Matrix().translate(0, -230)),
    justification: 'center',
    fontSize: 20,
  });
  guessText.fillColor = BLACK;
  guessText.content = getMessageText(recognizeResult.Score);
  if (recognizeResult.Score > 0.7) {
    const {width} = globalThis.gameElement.getBoundingClientRect();
    Array.from(Array(100)).forEach(() =>
      celebrationSparks.push(
        new Spark(
          getRandomPoint(
            guessText.point.x - width / 3,
            guessText.point.x + width / 3,
            guessText.point.y,
            guessText.point.y,
          ),
        ),
      ),
    );
  }
}

function drawPoints(points: Point[]): paper.Path {
  const {width, height} = globalThis.gameElement.getBoundingClientRect();
  const verticalPadding = height * 0.2;
  const horizontalPadding = width * 0.2;
  let minX = width;
  let maxX = 0;
  let minY = height;

  points.forEach((p) => {
    if (p.X > maxX) {
      maxX = p.X;
    }
    if (p.X < minX) {
      minX = p.X;
    }
    if (p.Y < minY) {
      minY = p.Y;
    }
  });

  const rightMostPoint = width - horizontalPadding * 2;
  const leftOffset = Math.abs(minX);
  const topOffset = Math.abs(minY);
  const multiplier = rightMostPoint / (maxX + leftOffset);

  const sigil = new paper.Path();
  sigil.strokeColor = new paper.Color(0, 0, 0, 0.2);
  sigil.strokeWidth = 10;

  points.forEach(({X, Y}) => {
    sigil.add({
      x: (X + leftOffset) * multiplier + horizontalPadding,
      y: (Y + topOffset) * multiplier + verticalPadding,
    });
  });

  return sigil;
}

function drawHelperText(): void {
  new paper.PointText({
    point: paper.view.center.transform(new paper.Matrix().translate(0, 230)),
    justification: 'center',
    fontSize: 20,
    fillColor: BLACK,
    content: 'Trace the shape',
  });
}

function drawUnicodeSigil(): void {
  const random = Math.random();
  if (random > 0.67) {
    currentSigil = new Triangle();
  } else if (random > 0.33) {
    currentSigil = new Square();
  } else {
    currentSigil = new Circle();
  }
  drawnSigil?.remove();
  drawnSigil = drawPoints(currentSigil.points);
  drawnSigil.closed = true;
}

function setupDrawListeners(): void {
  linePath = new paper.Path();
  leadingSparks = [];
  const tool = new paper.Tool();
  tool.minDistance = 1;
  tool.maxDistance = 10;

  function onMouseDown(event: paper.MouseEvent): void {
    isDrawing = true;
    linePath?.remove();
    leadingSparks.push(new Spark(event.point));

    linePath.add(event.point);

    linePath = new paper.Path({insert: true});

    linePath.strokeColor = TEAL;
    linePath.shadowColor = TURQUOISE;
    linePath.shadowBlur = 10;
    linePath.strokeWidth = 7;
    linePath.add(event.point);
  }

  function onMouseUp(event: paper.MouseEvent): void {
    if (!isDrawing) {
      return;
    }
    isDrawing = false;
    linePath.add(event.point);
    linePath.simplify();
    getDollarRecognized(linePath);
    drawUnicodeSigil();
  }

  function onMouseDrag(event: paper.MouseEvent): void {
    if (!isDrawing) {
      return;
    }
    if (event.timeStamp % 2) {
      leadingSparks.push(
        new Spark(new paper.Point(event.point.x + event.delta.x / 2, event.point.y + event.delta.y / 2)),
      );
    }

    linePath.add(event.point);

    if (linePath.length > 5_000) {
      onMouseUp(event);
    }
  }

  tool.onMouseDown = onMouseDown;
  tool.onMouseUp = onMouseUp;
  tool.onMouseDrag = onMouseDrag;
}

function onFrame(event: OnFrameEvent): void {
  if (guessText?.opacity > 0) {
    guessText.opacity *= 0.9;
    if (typeof guessText.fontSize === 'number') {
      guessText.fontSize++;
      guessText.position.y++;
    }
    if (guessText.opacity <= 0.05) {
      guessText.remove();
    }
  }
  if (leadingSparks.length) {
    if (leadingSparks[0].circle.opacity < 0) {
      leadingSparks.shift()?.circle?.remove();
    }
    leadingSparks.forEach((spark) => {
      spark.step();
    });
  }
  if (celebrationSparks.length) {
    if (celebrationSparks[0].circle.opacity < 0) {
      celebrationSparks.shift()?.circle?.remove();
    }
    celebrationSparks.forEach((spark) => {
      spark.step(0.03);
    });
  }
  if (!isDrawing && linePath?.opacity > 0) {
    linePath.opacity -= event.delta * 2;
  }
}

window.addEventListener('load', () => {
  const gameElement = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (gameElement) {
    gameElement.onwheel = (event): void => {
      event.preventDefault();
    };

    initCanvasSize(gameElement);

    paper.setup(globalThis.gameElement);
    drawUnicodeSigil();
    drawHelperText();

    setupDrawListeners();
    paper.view.onFrame = onFrame;
  }
});

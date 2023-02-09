import './index.scss';
import * as paper from 'paper';
import {Sigil} from './classes/sigils/Sigil';
import {Square} from './classes/sigils/Square';
import {Triangle} from './classes/sigils/Triangle';
import {Point} from './lib/dollar';

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
    fontSize: 30,
    fillColor: 'black',
  });
  guessText.content = `${Math.floor(recognizeResult.Score * 1000) / 10}%`;
}

function drawPoints(points: Point[]): paper.Path {
  const {width, height} = globalThis.gameElement.getBoundingClientRect();
  const verticalPadding = height * 0.1;
  const horizontalPadding = width * 0.1;
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

  const rightMostPoint = width * 0.8;
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

function drawUnicodeSigil(): void {
  currentSigil = Math.random() > 0.5 ? new Triangle() : new Square();
  drawnSigil?.remove();
  drawnSigil = drawPoints(currentSigil.points);
  drawnSigil.closed = true;
}

function setupDrawListeners(): void {
  linePath = new paper.Path();
  const tool = new paper.Tool();
  tool.minDistance = 1;
  tool.maxDistance = 10;

  function onMouseDown(event: paper.MouseEvent): void {
    isDrawing = true;
    linePath?.remove();
    linePath = new paper.Path({insert: true});
    linePath.strokeColor = new paper.Color('black');
    linePath.strokeWidth = 7;
    linePath.add(event.point);
  }

  function onMouseDrag(event: paper.MouseEvent): void {
    linePath.add(event.point);
  }

  function onMouseUp(event: paper.MouseEvent): void {
    isDrawing = false;
    linePath.add(event.point);
    linePath.simplify();
    getDollarRecognized(linePath);
    drawUnicodeSigil();
  }

  tool.onMouseDown = onMouseDown;
  tool.onMouseUp = onMouseUp;
  tool.onMouseDrag = onMouseDrag;
}

function onFrame(_event: OnFrameEvent): void {
  if (guessText?.opacity > 0) {
    guessText.opacity -= 0.005;
    if (guessText.opacity <= 0) {
      guessText.remove();
    }
  }
  if (!isDrawing && linePath?.opacity > 0) {
    linePath.opacity -= 0.005;
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

    setupDrawListeners();
    paper.view.onFrame = onFrame;
  }
});
import './index.scss';
import * as paper from 'paper';
import {SigilQueue} from './classes/SigilQueue';
import {Sigil} from './classes/sigils/Sigil';
import {Spark} from './classes/Spark';
import {BLACK, TEAL, TURQUOISE} from './colors';
import {Point} from './lib/dollar';
import {getMinMax, OnFrameEvent} from './vectorUtils';

screen.orientation?.lock?.('portrait');

let tool: paper.Tool;
let sigilQueue: SigilQueue;
let drawnSigil: paper.Path;
let helperText: paper.PointText;
let linePath: paper.Path;
let leadingSparks: Spark[];
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
function drawPoints(points: Point[]): paper.Path {
  const {width, height} = globalThis.gameElement.getBoundingClientRect();
  const verticalPadding = height * 0.2;
  const horizontalPadding = width * 0.2;
  const {minX, minY, maxX} = getMinMax(points);

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
  helperText = new paper.PointText({
    point: paper.view.center.transform(new paper.Matrix().translate(0, 230)),
    justification: 'center',
    fontSize: 20,
    fillColor: BLACK,
    content: 'Trace the shape',
  });
}

function drawUnicodeSigil(currentSigil: Sigil): void {
  if (drawnSigil) {
    drawnSigil.remove();
  }
  drawnSigil = drawPoints(currentSigil.points);
  drawnSigil.closed = true;
}

function setupDrawListeners(): void {
  linePath = new paper.Path();
  leadingSparks = [];
  tool = new paper.Tool();
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
    sigilQueue.handleDrawnLine(linePath);
    drawUnicodeSigil(sigilQueue.currentSigil);
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

export function killSigil(sigil: Sigil): void {
  sigilQueue.killSigil(sigil);

  if (sigilQueue.currentSigil) {
    drawUnicodeSigil(sigilQueue.currentSigil);
  } else {
    drawnSigil?.remove();
    helperText?.remove();
    tool?.remove();
  }
}

function onFrame(event: OnFrameEvent): void {
  sigilQueue.onFrame(event);
  if (leadingSparks.length) {
    if (leadingSparks[0].circle.opacity < 0) {
      leadingSparks.shift()?.circle?.remove();
    }
    leadingSparks.forEach((spark) => {
      spark.step();
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
    sigilQueue = new SigilQueue();
    drawUnicodeSigil(sigilQueue.currentSigil);
    drawHelperText();

    setupDrawListeners();
    paper.view.onFrame = onFrame;
  }
});

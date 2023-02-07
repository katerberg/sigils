import './index.scss';
import * as paper from 'paper';
import DollarRecognizer from './lib/dollar';

screen.orientation?.lock?.('portrait');

type OnFrameEvent = {
  delta: number;
  time: number;
  count: number;
};

// let currentSigil: paper.Path;
let guessText: paper.PointText;

function initCanvasSize(canvas: HTMLCanvasElement): void {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  canvas.width = 1000; //horizontal resolution (?) - increase for better looking text
  canvas.height = 1778; //vertical resolution (?) - increase for better looking text
  canvas.style.width = `${width}`; //actual width of canvas
  canvas.style.height = `${height}`; //actual height of canvas
  globalThis.gameElement = canvas;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function drawSpinningRectangle(): void {
  const rectangle = new paper.Path.Rectangle([75, 75], [100, 100]);
  rectangle.strokeColor = new paper.Color('black');
  rectangle.fillColor = new paper.Color('red');

  paper.view.onFrame = (e: OnFrameEvent): void => {
    // On each frame, rotate the path by 3 degrees:
    if (e.count % 2 === 0) {
      rectangle.rotate(3);
      rectangle.opacity = ((rectangle.opacity * 100 + 1) % 100) / 100;
      if (rectangle.fillColor) {
        rectangle.fillColor.hue += 1;
      }
    }
  };
}

function getDollarRecognized(linePath: paper.Path): void {
  const recognizer = new DollarRecognizer();

  const recognizeResult = recognizer.Recognize(
    linePath.segments.map((s) => ({X: s.point.x, Y: s.point.y})),
    true,
  );
  guessText?.remove();
  guessText = new paper.PointText({
    point: paper.view.center.transform(new paper.Matrix().translate(0, -330)),
    justification: 'center',
    fontSize: 30,
    fillColor: 'black',
  });
  guessText.content = `
  Guess: ${recognizeResult.Name}
  Chance: ${Math.floor(recognizeResult.Score * 1000) / 10}%
  `;
}

function setupDrawListeners(): void {
  const tool = new paper.Tool();
  tool.minDistance = 10;
  tool.maxDistance = 10;

  let linePath = new paper.Path();

  function onMouseDown(event: paper.MouseEvent): void {
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
    linePath.add(event.point);
    linePath.simplify();
    getDollarRecognized(linePath);
  }

  tool.onMouseDown = onMouseDown;
  tool.onMouseUp = onMouseUp;
  tool.onMouseDrag = onMouseDrag;
}

// function drawSigilToTrace(): void {
//   const {width, height} = globalThis.gameElement.getBoundingClientRect();
//   const outerPath = new paper.Path();
//   outerPath.strokeColor = new paper.Color(0, 0, 0, 1);
//   outerPath.fillColor = new paper.Color(0, 0, 0, 0.2);

//   const topOuterLeftPoint = {x: width * 0.1, y: height * 0.1};
//   const topOuterRightPoint = {x: width * 0.9, y: height * 0.1};
//   outerPath.add(new paper.Segment(topOuterLeftPoint, undefined, {x: width * 0.4, y: height * 1.7}));
//   outerPath.add(new paper.Segment(topOuterRightPoint, undefined, {x: width * -0.4, y: height * 1.7}));

//   outerPath.smooth();

//   const sigilLegWidth = 40;
//   const innerPath = outerPath.clone();
//   innerPath.segments[0].point.x += sigilLegWidth;
//   innerPath.segments[0].handleOut.x -= sigilLegWidth;
//   innerPath.segments[0].handleOut.y -= sigilLegWidth * 2;
//   innerPath.segments[1].point.x -= sigilLegWidth;
//   innerPath.segments[1].handleOut.y -= sigilLegWidth * 2;
//   innerPath.smooth();

//   const arch = outerPath.subtract(innerPath);
//   innerPath.remove();
//   outerPath.remove();

//   currentSigil = arch as paper.Path;
// }

window.addEventListener('load', () => {
  const gameElement = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (gameElement) {
    gameElement.onwheel = (event): void => {
      event.preventDefault();
    };

    initCanvasSize(gameElement);

    paper.setup(globalThis.gameElement);

    // drawSigilToTrace();
    setupDrawListeners();
  }
});

import './index.scss';
import * as paper from 'paper';

screen.orientation?.lock?.('portrait');

type OnFrameEvent = {
  delta: number;
  time: number;
  count: number;
};

let currentSigil: paper.Path;

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

function drawScore(drawnPath: paper.Path): void {
  console.log(drawnPath.getIntersections(currentSigil));
  const subtracted = currentSigil.subtract(drawnPath, {insert: false}) as paper.Path;
  console.log(subtracted.area);
}

function setupDrawListeners(): void {
  const tool = new paper.Tool();
  // tool.minDistance = 10;
  // tool.maxDistance = 45;

  let path = new paper.Path();

  function onMouseDown(event: paper.MouseEvent): void {
    path.remove();
    path = new paper.Path();
    // path.strokeColor = new paper.Color('black');
    // path.strokeWidth = 20;
    path.fillColor = new paper.Color('orange');
    path.add(event.point);
  }

  function onMouseDrag(event: paper.MouseEvent): void {
    // path.add(event.point);
    const step = event.delta.clone();
    step.x /= 2;
    step.y /= 2;
    step.angle += 90;
    // const step = {x: event.delta.x / 2, y: event.delta.y / 2};

    const top = event.point.clone();
    top.x += step.x;
    top.y += step.y;
    const bottom = event.point.clone();
    bottom.x -= step.x;
    bottom.y -= step.y;
    // const top = event.middlePoint + step;
    // const bottom = event.middlePoint - step;

    path.add(top);
    path.insert(0, bottom);
    path.smooth();
  }

  function onMouseUp(event: paper.MouseEvent): void {
    path.add(event.point);
    path.smooth();
    drawScore(path);
  }

  tool.onMouseDown = onMouseDown;
  tool.onMouseUp = onMouseUp;
  tool.onMouseDrag = onMouseDrag;
}

function drawSigilToTrace(): void {
  const {width, height} = globalThis.gameElement.getBoundingClientRect();
  const outerPath = new paper.Path();
  outerPath.strokeColor = new paper.Color(0, 0, 0, 1);
  outerPath.fillColor = new paper.Color(0, 0, 0, 0.2);

  const topOuterLeftPoint = {x: width * 0.1, y: height * 0.1};
  const topOuterRightPoint = {x: width * 0.9, y: height * 0.1};
  outerPath.add(new paper.Segment(topOuterLeftPoint, undefined, {x: width * 0.4, y: height * 1.7}));
  outerPath.add(new paper.Segment(topOuterRightPoint, undefined, {x: width * -0.4, y: height * 1.7}));

  outerPath.smooth();

  const innerPath = outerPath.clone();
  innerPath.segments[0].point.x += 20;
  innerPath.segments[0].handleOut.x -= 20;
  innerPath.segments[0].handleOut.y -= 40;
  innerPath.segments[1].point.x -= 20;
  innerPath.segments[1].handleOut.y -= 40;
  innerPath.smooth();

  const arch = outerPath.subtract(innerPath);
  innerPath.remove();
  outerPath.remove();

  currentSigil = arch as paper.Path;
}

window.addEventListener('load', () => {
  const gameElement = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (gameElement) {
    gameElement.onwheel = (event): void => {
      event.preventDefault();
    };

    initCanvasSize(gameElement);

    // Create an empty project and a view for the canvas:
    paper.setup(globalThis.gameElement);

    drawSigilToTrace();
    setupDrawListeners();
  }
});

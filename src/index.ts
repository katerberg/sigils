import './index.scss';
import * as paper from 'paper';

screen.orientation?.lock?.('portrait');

type OnFrameEvent = {
  delta: number;
  time: number;
  count: number;
};

function initCanvasSize(canvas: HTMLCanvasElement): void {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  canvas.width = 1000; //horizontal resolution (?) - increase for better looking text
  canvas.height = 1778; //vertical resolution (?) - increase for better looking text
  canvas.style.width = `${width}`; //actual width of canvas
  canvas.style.height = `${height}`; //actual height of canvas
  globalThis.gameElement = canvas;
}

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

function setupDrawListeners(): void {
  const tool = new paper.Tool();
  // tool.minDistance = 10;
  // tool.maxDistance = 45;

  let path = new paper.Path();

  function onMouseDown(event: paper.MouseEvent): void {
    path = new paper.Path();
    path.strokeColor = new paper.Color('black');
    path.strokeWidth = 20;
    path.add(event.point);
  }

  function onMouseDrag(event: paper.MouseEvent): void {
    path.add(event.point);
    path.smooth();
  }

  function onMouseUp(event: paper.MouseEvent): void {
    path.add(event.point);
    path.smooth();
  }
  tool.onMouseDown = onMouseDown;
  tool.onMouseUp = onMouseUp;
  tool.onMouseDrag = onMouseDrag;
}

function drawSigilToTrace(): void {
  const {width, height} = globalThis.gameElement.getBoundingClientRect();
  const path = new paper.Path();
  path.strokeColor = new paper.Color(0, 0, 0, 0.2);
  path.strokeWidth = 20;
  path.add(new paper.Segment({x: width * 0.1, y: height * 0.1}, undefined, {x: width * 0.4, y: height * 1.7}));
  path.add(new paper.Segment({x: width * 0.9, y: height * 0.1}, undefined, {x: width * -0.4, y: height * 1.7}));
  path.smooth();
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

    drawSpinningRectangle();
    drawSigilToTrace();
    setupDrawListeners();
  }
});

import './index.scss';
import * as paper from 'paper';
import {drawSomeText} from './utils';

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

window.addEventListener('load', () => {
  const gameElement = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (gameElement) {
    initCanvasSize(gameElement);

    // Create an empty project and a view for the canvas:
    paper.setup(gameElement);

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

    drawSomeText('Sigils', undefined, undefined, {textAlign: 'center'});
    gameElement.onwheel = (event): void => {
      event.preventDefault();
    };
  }
});

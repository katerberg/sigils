import './index.scss';
import {drawSomeText} from './utils';

screen.orientation?.lock?.('portrait');

window.addEventListener('load', () => {
  const gameElement = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (gameElement) {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    gameElement.width = 1000; //horizontal resolution (?) - increase for better looking text
    gameElement.height = 500; //vertical resolution (?) - increase for better looking text
    gameElement.style.width = `${width}`; //actual width of canvas
    gameElement.style.height = `${height}`; //actual height of canvas

    globalThis.gameElement = gameElement;
    drawSomeText('Sigils', undefined, undefined, {textAlign: 'center'});
    gameElement.onwheel = (event): void => {
      event.preventDefault();
    };
  }
});

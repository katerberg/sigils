import {Circle} from './classes/sigils/Circle';
import {Sigil} from './classes/sigils/Sigil';
import {Square} from './classes/sigils/Square';
import {Triangle} from './classes/sigils/Triangle';

export function getRandomSigil(): Sigil {
  const random = Math.random();
  if (random > 0.67) {
    return new Triangle();
  } else if (random > 0.33) {
    return new Square();
  }
  return new Circle();
}

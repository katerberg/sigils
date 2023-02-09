import * as paper from 'paper';

export const TRANSPARENT = new paper.Color('rgba(255,255,255,0)');

export const TEAL = new paper.Color('#008080');
export const TURQUOISE = new paper.Color('#30D5C8');

export const SPARK_AQUA = new paper.Color('#b4fee7');
export const SPARK_FUCHSIA = new paper.Color('#fd49a0');
export const SPARK_PURPLE = new paper.Color('#603f8b');
export const SPARK_VIOLET = new paper.Color('#a16ae8');

export function getRandomSparkColor(): paper.Color {
  const random = Math.random();
  if (random < 0.25) {
    return SPARK_AQUA;
  } else if (random < 0.5) {
    return SPARK_FUCHSIA;
  } else if (random < 0.75) {
    return SPARK_PURPLE;
  }

  return SPARK_VIOLET;
}

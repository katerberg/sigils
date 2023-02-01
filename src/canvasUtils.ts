const PIXEL_RATIO = window.devicePixelRatio || 1;

export function createHiDPICanvas(w: number, h: number, ratio: number = PIXEL_RATIO): HTMLCanvasElement {
  const can = document.createElement('canvas');
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = `${w}px`;
  can.style.height = `${h}px`;
  can.getContext('2d')?.setTransform?.(ratio, 0, 0, ratio, 0, 0);
  return can;
}

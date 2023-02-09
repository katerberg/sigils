export class Point {
  X: number;

  Y: number;

  ID: number;

  Angle: number;

  constructor(x: number, y: number, id: number, angle = 0.0) {
    this.X = x;
    this.Y = y;
    this.ID = id;
    this.Angle = angle; // normalized turning angle, $P+
  }
}


declare class Result {
    constructor(name: string, score: number, ms: number);
    Name: string;

    Score: number;

    Time: number;
}

type Point = {
    X: number;
    Y: number;
    ID: number;
    Angle: number
}

type PointCloud = {
    Name: string;
    Points: Point[];
    Vector: number[];
}

// eslint-disable-next-line import/no-default-export
export default class DollarRecognizer {
    constructor();

    PointClouds: PointCloud[];

    AddGesture(strokeName: string, points: Point[]): number;
    Recognize(points: Point[], useProtractor: boolean): Result;
    DeleteUserGestures(): void;
}

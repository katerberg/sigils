
declare class Result {
    constructor(name: string, score: number, ms: number);
    Name: string;

    Score: number;

    Time: number;
}

type Point = {
    X: number;
    Y: number;
}

// eslint-disable-next-line import/no-default-export
export default class DollarRecognizer {
    constructor();

    AddGesture(strokeName: string, points: Point[]): number;
    Recognize(points: Point[], useProtractor: boolean): Result;
    DeleteUserGestures(): void;
}

export function isDebug(): boolean {
  const url = new URL(window.location.href);
  const debug = url.searchParams.get('debug');
  return debug !== null;
}

export function clearCanvas(): void {
  const ctx = (globalThis.gameElement as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    const prevFill = ctx.fillStyle;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevFill;
  }
}

type DrawOptions = {
  color?: string;
  font?: string;
  textAlign?: CanvasTextAlign;
};

export function drawSomeText(text: string, x?: number, y?: number, options?: DrawOptions): void {
  const ctx = (globalThis.gameElement as HTMLCanvasElement)?.getContext('2d');
  if (ctx) {
    const prevAlign = ctx.textAlign;
    const prevFill = ctx.fillStyle;
    const prevFont = ctx.font;
    ctx.textAlign = options?.textAlign || 'left';
    ctx.fillStyle = options?.color || 'white';
    ctx.font = options?.font || '50px sans-serif';

    ctx.fillText(text, x || ctx.canvas.width / 2, y || ctx.canvas.height / 2);

    ctx.textAlign = prevAlign;
    ctx.fillStyle = prevFill;
    ctx.font = prevFont;
  }
}

export function waitFor(ms: number): Promise<void> {
  let resolve: () => void;
  const promise = new Promise((promiseResolve) => {
    resolve = promiseResolve as () => void;
  }) as Promise<void>;
  setTimeout(() => resolve(), ms);
  return promise;
}

// @description: wrapText wraps HTML canvas text onto a canvas of fixed width
// @param ctx - the context for the canvas we want to wrap text on
// @param text - the text we want to wrap.
// @param x - the X starting point of the text on the canvas.
// @param y - the Y starting point of the text on the canvas.
// @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
// @param lineHeight - the height of each line, so we can space them below each other.
// @returns an array of [ lineText, x, y ] for all lines
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): [lineText: string, x: number, y: number][] {
  // First, start by splitting all of our text into words, but splitting it into an array split by spaces
  const words = text.split(' ');
  let movingY = y;
  let line = ''; // This will store the text of the current line
  let testLine = ''; // This will store the text when we add a word, to test if it's too long
  const lineArray: [string, number, number][] = []; // This is an array of lines, which the function will return

  // Lets iterate over each word
  for (let n = 0; n < words.length; n++) {
    // Create a test line, and measure it..
    testLine += `${words[n]} `;
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    // If the width of this test line is more than the max width
    if (testWidth > maxWidth && n > 0) {
      // Then the line is finished, push the current line into "lineArray"
      lineArray.push([line, x, movingY]);
      // Increase the line height, so a new line is started
      movingY += lineHeight;
      // Update line and test line to use this word as the first word on the next line
      line = `${words[n]} `;
      testLine = `${words[n]} `;
    } else {
      // If the test line is still less than the max width, then add the word to the current line
      line += `${words[n]} `;
    }
    // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
    if (n === words.length - 1) {
      lineArray.push([line, x, movingY]);
    }
  }
  // Return the line array
  return lineArray;
}

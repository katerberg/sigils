export function getMessageText(percentageMatch: number): string {
  if (percentageMatch > 0.7) {
    return 'Perfect!';
  }
  if (percentageMatch > 0.5) {
    return 'Great!';
  }
  if (percentageMatch > 0.3) {
    return 'Good';
  }
  if (percentageMatch > 0.2) {
    return 'Okay.';
  }
  return 'Try again';
}

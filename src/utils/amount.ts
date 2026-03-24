export function digitsToAmount(digits: string): number {
  if (!digits || digits === '0') return 0;
  const cents = parseInt(digits, 10);
  return Math.round(cents) / 100;
}

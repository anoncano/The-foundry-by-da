export function validateRateCap(rate: number, maxRate: number) {
  return rate > maxRate ? maxRate : rate;
}

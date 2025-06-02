export function approximateKSPValue(lambda: number): number {
  // Handle perfect fit case
  if (lambda === 0) {
    return 1;
  }

  const maxK = 50;
  let sum = 0;

  for (let k = 1; k <= maxK; k++) {
    const sign = k % 2 === 1 ? 1 : -1;
    const exponent = -2 * k * k * lambda * lambda;
    sum += sign * Math.exp(exponent);
  }

  return 2 * sum;
}

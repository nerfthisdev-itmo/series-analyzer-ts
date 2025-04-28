import { describe, expect, it } from 'vitest';
import { VariationSeries } from '@/services/variationSeries';

describe('VariationSeries', () => {
  const testData = [
    2, 0, 1, 2, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 0, 4, 0, 0, 1, 0, 4, 1, 1,
    0, 2, 1, 0, 0, 2, 1, 1, 1, 1, 0, 1, 1, 0, 3, 1, 2, 1, 0, 1, 2, 1, 2, 3, 0,
    2, 4, 0, 0, 0, 3, 0, 2, 0, 2, 2, 2, 1, 1,
  ];

  const series = new VariationSeries(testData);

  it('calculate basic statistics correctly', () => {
    expect(series.min).toBe(0);
    expect(series.max).toBe(4);
    expect(series.range).toBe(4);
    expect(series.n).toBe(64);
  });

  it('calculate expected value estimate and deviation', () => {
    expect(series.expectedValueEstimate).toBeCloseTo(1.1094, 1);
    expect(series.expectedValueDeviation).toBeCloseTo(0, 1);
  });

  it('calculate sample standard deviation', () => {
    expect(series.sampleStandardDeviation).toBeCloseTo(1.0914);
  });
});

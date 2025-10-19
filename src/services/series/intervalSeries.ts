import { AbstractSeries } from "./AbstractSeries";

export class IntervalVariationSeries extends AbstractSeries {
  private _intervalCount: number | null = null;
  private _intervalBorders: Array<number> | null = null;
  private _statisticalSeries: Record<string, number> = {};
  private _binCenters: Array<number> | null = null;
  private _cumulativeValues: Array<number> = [];

  get intervalCount(): number {
    if (this._intervalCount === null) {
      this._intervalCount = Math.floor(1 + Math.log2(this._n));
    }
    return this._intervalCount;
  }

  get intervalLength(): number {
    return this.range / this.intervalCount;
  }

  get intervalBorders(): Array<number> {
    if (!this._intervalBorders) {
      const borders = [];
      const start = this.min;
      const length = this.intervalLength;
      for (let i = 0; i <= this.intervalCount; i++) {
        borders.push(start + i * length);
      }
      this._intervalBorders = borders;
    }
    return this._intervalBorders;
  }

  get binCenters(): Array<number> {
    if (!this._binCenters) {
      const borders = this.intervalBorders;
      this._binCenters = [];
      for (let i = 0; i < borders.length - 1; i++) {
        this._binCenters.push((borders[i] + borders[i + 1]) / 2);
      }
    }
    return this._binCenters;
  }

  getStatisticalSeries(): Record<string, number> {
    if (Object.keys(this._statisticalSeries).length === 0) {
      const series = new Array(this.intervalCount).fill(0);
      const start = this.min;
      for (const num of this.data) {
        let idx = Math.floor((num - start) / this.intervalLength);
        idx = Math.min(idx, this.intervalCount - 1);
        series[idx]++;
      }
      const borders = this.intervalBorders;
      for (let i = 0; i < this.intervalCount; i++) {
        const key = `[${borders[i].toFixed(2)}, ${borders[i + 1].toFixed(2)})`;
        this._statisticalSeries[key] = series[i];
      }
    }
    return this._statisticalSeries;
  }

  getCdf(x: number): number {
    let count = 0;
    for (const value of this.data) {
      if (value <= x) count++;
    }
    return count / this._n;
  }

  get mean(): number {
    const centers = this.binCenters;
    const counts = Object.values(this.getStatisticalSeries());
    let total = 0;
    for (let i = 0; i < centers.length; i++) {
      total += centers[i] * counts[i];
    }
    return total / this._n;
  }

  get variance(): number {
    const mean = this.mean;
    const centers = this.binCenters;
    const counts = Object.values(this.getStatisticalSeries());
    let total = 0;
    for (let i = 0; i < centers.length; i++) {
      total += (centers[i] - mean) ** 2 * counts[i];
    }
    return total / this._n;
  }

  get sampleVariance(): number {
    return this.variance * (this.n / (this.n - 1));
  }

  get standardDeviation(): number {
    return Math.sqrt(this.variance);
  }

  get mode(): number {
    const counts = Object.values(this.getStatisticalSeries());
    const maxCount = Math.max(...counts);
    const modalIdx = counts.indexOf(maxCount);
    const borders = this.intervalBorders;

    const prevCount = modalIdx > 0 ? counts[modalIdx - 1] : 0;
    const nextCount = modalIdx < counts.length - 1 ? counts[modalIdx + 1] : 0;

    return (
      borders[modalIdx] +
      this.intervalLength *
        ((maxCount - prevCount) /
          (maxCount - prevCount + (maxCount - nextCount)))
    );
  }

  get cumulativeValues(): Array<number> {
    if (this._cumulativeValues.length === 0) {
      let prev = 0;
      this._cumulativeValues = Object.values(this.getStatisticalSeries()).map(
        (count) => {
          const result = prev;
          prev += count;
          return result;
        },
      );
    }
    return this._cumulativeValues;
  }

  get median(): number {
    const counts = Object.values(this.getStatisticalSeries());
    const cumulative: Array<number> = [];
    let total = 0;
    for (const count of counts) {
      total += count;
      cumulative.push(total);
    }

    const target = this._n / 2;
    let medianIdx = 0;
    while (medianIdx < cumulative.length && cumulative[medianIdx] < target) {
      medianIdx++;
    }

    const lowerBound = this.intervalBorders[medianIdx];
    const prevTotal = medianIdx === 0 ? 0 : cumulative[medianIdx - 1];
    return (
      lowerBound +
      ((target - prevTotal) / counts[medianIdx]) * this.intervalLength
    );
  }

  getNthMoment(moment: number): number {
    const mean = this.mean;
    const stdDev = this.standardDeviation;
    let total = 0;
    const centers = this.binCenters;
    const counts = Object.values(this._statisticalSeries);

    for (let i = 0; i < centers.length; i++) {
      total += (centers[i] - mean) ** moment * counts[i];
    }
    return total / (this._n * stdDev ** moment);
  }

  get skewness(): number {
    return this.getNthMoment(3);
  }

  get kurtosis(): number {
    return this.getNthMoment(4) - 3;
  }

  get sampleStandardDeviation(): number {
    return Math.sqrt(this.variance * (this.n / (this.n - 1)));
  }
}

export function isIntervalSeries(
  series: AbstractSeries,
): series is IntervalVariationSeries {
  return "intervalCount" in series;
}

import { jStat } from "jstat";

export class VariationSeries {
  private data: Array<number>;
  private _n: number;
  private _min: number;
  private _max: number;
  private _statisticalSeries: Record<string, number> = {};
  private _mode: number | null = null;
  private _median: number | null = null;
  private _expectedValueEstimate: number | null = null;
  private _sampleVariance: number | null = null;
  private _cumulativeValues: Array<number> = [];

  constructor(data: Array<number>) {
    this.data = [...data].sort((a, b) => a - b);
    this._n = data.length;
    this._min = Math.min(...data);
    this._max = Math.max(...data);
  }

  get n(): number {
    return this._n;
  }

  get min(): number {
    return this._min;
  }

  get max(): number {
    return this._max;
  }

  get range(): number {
    return this.max - this.min;
  }

  get initial_data(): Array<number> {
    return this.data;
  }

  get statisticalSeries(): Record<string, number> {
    if (Object.keys(this._statisticalSeries).length === 0) {
      const freqMap: Record<string, number> = {};
      for (const num of this.data) {
        const key = num.toString();
        freqMap[key] = (freqMap[key] || 0) + 1;
      }
      this._statisticalSeries = freqMap;
    }
    return this._statisticalSeries;
  }

  get mode(): number {
    if (!this._mode) {
      let maxCount = -Infinity;
      let modeValue = NaN;

      for (const [key, count] of Object.entries(this.statisticalSeries)) {
        if (count > maxCount) {
          maxCount = count;
          modeValue = parseFloat(key);
        }
      }
      this._mode = modeValue;
    }
    return this._mode;
  }

  get median(): number {
    if (!this._median) {
      const n = this.data.length;
      if (n % 2 === 0) {
        const mid = n / 2;
        this._median = (this.data[mid - 1] + this.data[mid]) / 2;
      } else {
        this._median = this.data[Math.floor(n / 2)];
      }
    }
    return this._median;
  }

  get expectedValueEstimate(): number {
    if (!this._expectedValueEstimate) {
      const arrSum = this.data.reduce((sum: number, p: number) => sum + p);
      this._expectedValueEstimate = (1 / this.n) * arrSum;
    }
    return this._expectedValueEstimate;
  }

  get expectedValueDeviation(): number {
    const mean = this.expectedValueEstimate;
    return this.data.reduce((sum, val) => sum + (val - mean), 0);
  }

  get sampleVariance(): number {
    if (!this._sampleVariance) {
      const mean = this.expectedValueEstimate;
      this._sampleVariance =
        this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
        this.data.length;
    }
    return this._sampleVariance;
  }

  get sampleStandardDeviation(): number {
    return Math.sqrt(this.sampleVariance);
  }

  get sampleStandardDeviationCorrected(): number {
    return Math.sqrt(
      this.sampleVariance * (this.data.length / (this.data.length - 1)),
    );
  }

  get cumulativeValues(): Array<number> {
    if (this._cumulativeValues.length === 0) {
      let prev = 0;
      this._cumulativeValues = Object.values(this.statisticalSeries).map(
        (count) => {
          const current = prev;
          prev += count;
          return current;
        },
      );
    }
    return this._cumulativeValues;
  }

  getNthMoment(nthOrder: number): number {
    const mean = this.expectedValueEstimate;
    return (
      this.data.reduce((sum, val) => sum + Math.pow(val - mean, nthOrder), 0) /
      this.data.length
    );
  }

  // getCdf(x: number): number {
  //   let count = 0;
  //   for (const value of this.data) {
  //     if (value < x) count++;
  //   }
  //   return count / this.data.length;
  // }

  getCdf(x: number): number {
    let count = 0;

    this.data.forEach((value) => {
      if (value <= x) {
        count++;
      }
    });

    return count / this._n;
  }
}

export const laplaceFunction = (x: number): number => {
  return x < 0 ? 0.5 * Math.exp(x) : 1 - 0.5 * Math.exp(-x);
};

export const studentCoefficient = (gamma: number, n: number): number => {
  const degreesOfFreedom = n - 1;
  return jStat.studentt.inv((1 + gamma) / 2, degreesOfFreedom);
};

export const getInverseLaplace = (alpha: number): number => {
  if (alpha < 0.5) return Math.log(2 * alpha);
  return -Math.log(2 * (1 - alpha));
};

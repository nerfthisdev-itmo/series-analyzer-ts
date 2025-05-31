import { AbstractSeries } from "./AbstractSeries";

export class VariationSeries extends AbstractSeries {
  private _statisticalSeries: Record<string, number> = {};
  private _cumulativeValues: Array<number> = [];

  getStatisticalSeries(): Record<string, number> {
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

  getCdf(x: number): number {
    let count = 0;
    this.data.forEach((value) => {
      if (value <= x) {
        count++;
      }
    });
    return count / this._n;
  }

  get mean(): number {
    const arrSum = this.data.reduce((sum: number, p: number) => sum + p);
    return (1 / this.n) * arrSum;
  }

  get variance(): number {
    const mean = this.mean;
    return (
      this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      this.data.length
    );
  }

  get standardDeviation(): number {
    return Math.sqrt(this.variance);
  }

  get sampleVariance(): number {
    return this.variance * (this.n / (this.n - 1));
  }

  get mode(): number {
    const freqMap = this.getStatisticalSeries();
    let max = -Infinity;
    let mode = 0;
    for (const [key, value] of Object.entries(freqMap)) {
      if (value > max) {
        max = value;
        mode = parseFloat(key);
      }
    }
    return mode;
  }

  get median(): number {
    const mid = Math.floor(this._n / 2);
    if (this._n % 2 === 0) {
      return (this.data[mid - 1] + this.data[mid]) / 2;
    }
    return this.data[mid];
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

  getNthMoment(order: number): number {
    const mean = this.mean;
    return this.data.reduce((sum, x) => sum + (x - mean) ** order, 0) / this._n;
  }

  get sampleStandardDeviation(): number {
    return Math.sqrt(this.variance * (this.n / (this.n - 1)));
  }

  get skewness(): number {
    return this.getNthMoment(3) / this.standardDeviation ** 3;
  }

  get kurtosis(): number {
    return this.getNthMoment(4) / this.standardDeviation ** 4 - 3;
  }
}

export function isVariationSeries(
  series: AbstractSeries,
): series is VariationSeries {
  return !("intervalCount" in series);
}

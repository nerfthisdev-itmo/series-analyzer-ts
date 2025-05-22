import { jStat } from "jstat";
import { getInverseLaplace, studentCoefficient } from "./seriesMath";

export class IntervalVariationSeries {
  private data: Array<number>;
  private _n: number;
  private _min: number;
  private _max: number;

  private _intervalBorders: Array<number> | null = null;
  private _statisticalSeries: Record<string, number> = {};
  private _binCenters: Array<number> | null = null;
  private _expectedValue: number | null = null;
  private _sampleVariance: number | null = null;
  public _cumulativeValues: Array<number> = [];

  constructor(data: Array<number>) {
    this.data = [...data].sort((a, b) => a - b);
    this._n = data.length;
    this._min = Math.min(...data);
    this._max = Math.max(...data);
  }

  get initial_data(): Array<number> {
    return this.data;
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

  get intervalCount(): number {
    return Math.floor(1 + Math.log2(this._n));
  }

  get intervalLength(): number {
    return this.range / this.intervalCount;
  }

  get intervalStartingPoint(): number {
    return this.min;
  }

  get intervalBorders(): Array<number> {
    if (!this._intervalBorders) {
      const start = this.intervalStartingPoint;
      const length = this.intervalLength;
      this._intervalBorders = [];
      for (let i = 0; i <= this.intervalCount; i++) {
        this._intervalBorders.push(start + i * length);
      }
    }
    return this._intervalBorders;
  }

  get statisticalSeries(): Record<string, number> {
    if (Object.keys(this._statisticalSeries).length === 0) {
      const series = new Array(this.intervalCount).fill(0);
      const start = this.intervalStartingPoint;
      const range = this.range;
      const intervalCount = this.intervalCount;

      for (const num of this.data) {
        const offset = num - start;
        let idx = Math.floor((offset / range) * intervalCount);
        idx = Math.min(idx, intervalCount - 1);
        series[idx]++;
      }

      const borders = this.intervalBorders;
      this._statisticalSeries = {};
      for (let i = 0; i < intervalCount; i++) {
        const intervalKey = `[${borders[i]}, ${borders[i + 1]})`;
        this._statisticalSeries[intervalKey] = series[i];
      }
    }
    return this._statisticalSeries;
  }

  get cumulativeValues(): Array<number> {
    if (this._cumulativeValues.length === 0) {
      let prev = 0;
      const values = [];
      for (const count of Object.values(this.statisticalSeries)) {
        values.push(prev);
        prev += count;
      }
      this._cumulativeValues = values;
    }
    return this._cumulativeValues;
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

  get expectedValue(): number {
    if (this._expectedValue === null) {
      let total = 0;
      const centers = this.binCenters;
      const counts = Object.values(this.statisticalSeries);
      for (let i = 0; i < centers.length; i++) {
        total += centers[i] * counts[i];
      }
      this._expectedValue = total / this._n;
    }
    return this._expectedValue;
  }

  get sampleVariance(): number {
    if (this._sampleVariance === null) {
      const mean = this.expectedValue;
      let total = 0;
      const centers = this.binCenters;
      const counts = Object.values(this.statisticalSeries);
      for (let i = 0; i < centers.length; i++) {
        total += (centers[i] - mean) ** 2 * counts[i];
      }
      this._sampleVariance = total / this._n;
    }
    return this._sampleVariance;
  }

  get sampleStandardDeviation(): number {
    return Math.sqrt(this.sampleVariance);
  }

  get mode(): number {
    const counts = Object.values(this.statisticalSeries);
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

  get median(): number {
    const counts = Object.values(this.statisticalSeries);
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
    if (medianIdx === 0) {
      return lowerBound + (target / counts[medianIdx]) * this.intervalLength;
    } else {
      const prevTotal = cumulative[medianIdx - 1];
      return (
        lowerBound +
        ((target - prevTotal) / counts[medianIdx]) * this.intervalLength
      );
    }
  }

  getNthMoment(moment: number): number {
    const mean = this.expectedValue;
    const stdDev = this.sampleStandardDeviation;
    let total = 0;
    const centers = this.binCenters;
    const counts = Object.values(this.statisticalSeries);

    for (let i = 0; i < centers.length; i++) {
      total += (centers[i] - mean) ** moment * counts[i];
    }
    return total / (this._n * stdDev ** moment);
  }

  getCdf(x: number): number {
    let count = 0;
    for (const value of this.data) {
      if (value < x) count++;
    }
    return count / this._n;
  }

  public getLognormalParams(): { mu: number; sigma: number } {
    const logData = this.data.map((x) => Math.log(x));
    const mu = logData.reduce((sum, x) => sum + x, 0) / this._n;
    const sigma = Math.sqrt(
      logData.reduce((sum, x) => sum + (x - mu) ** 2, 0) / this._n,
    );
    return { mu, sigma };
  }

  public getNormalConfidenceIntervals(gamma: number = 0.95): {
    mean: [number, number];
    variance: [number, number];
  } {
    return {
      mean: this.getNormalMeanCI(gamma),
      variance: this.getNormalVarianceCI(gamma),
    };
  }

  private getNormalMeanCI(gamma: number): [number, number] {
    const t = studentCoefficient(gamma, this._n);
    const margin = (t * this.sampleStandardDeviation) / Math.sqrt(this._n);
    return [this.expectedValue - margin, this.expectedValue + margin];
  }

  private getNormalVarianceCI(gamma: number): [number, number] {
    const alpha = 1 - gamma;
    const chi2 = (p: number) => jStat.chisquare.inv(p, this._n - 1);
    return [
      ((this._n - 1) * this.sampleVariance) / chi2(1 - alpha / 2),
      ((this._n - 1) * this.sampleVariance) / chi2(alpha / 2),
    ];
  }

  // Для логнормального распределения
  public getLognormalConfidenceIntervals(gamma: number = 0.95): {
    mu: [number, number];
    sigma: [number, number];
  } {
    const { mu, sigma } = this.getLognormalParams();
    const z = getInverseLaplace((1 + gamma) / 2);
    const n = this._n;

    return {
      mu: [mu - (z * sigma) / Math.sqrt(n), mu + (z * sigma) / Math.sqrt(n)],
      sigma: [
        sigma *
          Math.sqrt((n - 1) / jStat.chisquare.inv((1 + gamma) / 2, n - 1)),
        sigma *
          Math.sqrt((n - 1) / jStat.chisquare.inv((1 - gamma) / 2, n - 1)),
      ],
    };
  }

  private normalCdf(x: number, mu: number, sigma: number): number {
    return jStat.normal.cdf(x, mu, sigma);
  }

  private lognormalCdf(x: number, mu: number, sigma: number): number {
    return x <= 0 ? 0 : jStat.normal.cdf(Math.log(x), mu, sigma);
  }

  // 2.5 Характеристики распределений
  public getTheoreticalSkewness(
    type: "normal" | "lognormal",
    params: { mu: number; sigma: number },
  ): number {
    if (type === "normal") return 0;
    const sigma = params.sigma;
    return (Math.exp(sigma ** 2) + 2) * Math.sqrt(Math.exp(sigma ** 2) - 1);
  }

  public getTheoreticalKurtosis(
    type: "normal" | "lognormal",
    params: { mu: number; sigma: number },
  ): number {
    if (type === "normal") return 0;
    const sigma = params.sigma;
    return (
      Math.exp(4 * sigma ** 2) +
      2 * Math.exp(3 * sigma ** 2) +
      3 * Math.exp(2 * sigma ** 2) -
      6
    );
  }

  // TODO: refactor to use different distributions
  public getTheoreticalFrequencies() {
    const theoreticalFrequencies: Array<number> = [];
    const borders = this.intervalBorders;

    for (let i = 0; i < borders.length - 1; i++) {
      const lowerBound = borders[i];
      const upperBound = borders[i + 1];
      // Расчет теоретической частоты для интервала в нормальном распределении
      const prob =
        this.normalCdf(
          upperBound,
          this.expectedValue,
          this.sampleStandardDeviation,
        ) -
        this.normalCdf(
          lowerBound,
          this.expectedValue,
          this.sampleStandardDeviation,
        );
      theoreticalFrequencies.push(prob * this.n);
    }

    return theoreticalFrequencies;
  }
}

import { jStat } from "jstat";
import {  studentCoefficient } from "./seriesMath";
import type {DistributionType} from "./seriesMath";

export type Interval = {
  left: number;
  right: number;
};

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
    return [
      this.expectedValueEstimate - margin,
      this.expectedValueEstimate + margin,
    ];
  }

  private getNormalVarianceCI(gamma: number): [number, number] {
    const alpha = 1 - gamma;
    const chi2 = (p: number) => jStat.chisquare.inv(p, this._n - 1);
    return [
      ((this._n - 1) * this.sampleVariance) / chi2(1 - alpha / 2),
      ((this._n - 1) * this.sampleVariance) / chi2(alpha / 2),
    ];
  }

  // 1.1 Точечные оценки параметров для биномиального распределения
  public getBinomialParams(knownN?: number): { n: number; p: number } {
    // Если n известно из контекста задачи
    if (knownN !== undefined) {
      const p = this.expectedValueEstimate / knownN;
      return { n: knownN, p };
    }

    // Если n неизвестно (эвристика: максимальное значение + 1)
    const estimatedN = Math.max(...this.data) + 1;
    const p = this.expectedValueEstimate / estimatedN;
    return { n: estimatedN, p };
  }

  // 1.2 Теоретические частоты для дискретных распределений
  public getTheoreticalFrequencies(
    distribution: DistributionType,
    params?: { n?: number; p?: number },
  ): Record<number, number> {
    switch (distribution) {
      case "binomial":
        return this.calculateBinomialFrequencies(params?.n, params?.p);
      // Добавьте другие распределения по аналогии
      default:
        throw new Error("Unsupported distribution type");
    }
  }

  private calculateBinomialFrequencies(
    n?: number,
    p?: number,
  ): Record<number, number> {
    const { n: estN, p: estP } = this.getBinomialParams(n);
    const frequencies: Record<number, number> = {};

    for (let k = 0; k <= estN; k++) {
      frequencies[k] = jStat.binomial.pdf(k, estN, estP) * this._n;
    }

    return frequencies;
  }

  // 1.4 Доверительные интервалы для биномиального распределения
  public getBinomialConfidenceIntervals(gamma: number = 0.95): {
    p: [number, number];
  } {
    const { n, p } = this.getBinomialParams();
    const z = jStat.normal.inv(1 - (1 - gamma) / 2, 0, 1);
    const se = Math.sqrt((p * (1 - p)) / n);

    return {
      p: [Math.max(0, p - z * se), Math.min(1, p + z * se)],
    };
  }

  // 1.5 Числовые характеристики для биномиального распределения
  public getTheoreticalCharacteristics(distribution: "binomial"): {
    mean: number;
    variance: number;
    mode: number;
    skewness: number;
    kurtosis: number;
  } {
    const { n, p } = this.getBinomialParams();

    return {
      mean: n * p,
      variance: n * p * (1 - p),
      mode: Math.floor((n + 1) * p),
      skewness: (1 - 2 * p) / Math.sqrt(n * p * (1 - p)),
      kurtosis: (1 - 6 * p * (1 - p)) / (n * p * (1 - p)),
    };
  }
}

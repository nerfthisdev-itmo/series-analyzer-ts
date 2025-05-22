export abstract class AbstractSeries {
  protected data: Array<number>;
  protected _n: number;
  protected _min: number;
  protected _max: number;

  constructor(data: Array<number>) {
    this.data = [...data].sort((a, b) => a - b);
    this._n = this.data.length;
    this._min = Math.min(...data);
    this._max = Math.max(...data);
  }

  get n() {
    return this._n;
  }
  get min() {
    return this._min;
  }
  get max() {
    return this._max;
  }
  get range() {
    return this._max - this._min;
  }
  get initial_data() {
    return this.data;
  }

  abstract getStatisticalSeries(): Record<string, number>;
  abstract getCdf(x: number): number;

  abstract get mean(): number;
  abstract get variance(): number;
  abstract get standardDeviation(): number;
  abstract get mode(): number;
  abstract get median(): number;
  abstract get cumulativeValues(): Array<number>;
  abstract get sampleStandardDeviation(): number;
}

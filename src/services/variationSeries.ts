interface StatisticalSeries {
  [key: number]: number;
}

export class Variation {
  private data: Array<number>;
  private _n: number;
  private _min: number;
  private _max: number;
  private _statisticalSeries;

  constructor(data: Array<number>) {
    this.data = [...data].sort((a, b) => a - b);
    this._n = data.length;
    this._min = Math.min(...data);
    this._max = Math.max(...data);
    this._statisticalSeries = this.calcStatisticalSeries();
  }

  get variationseries(): Array<number> {
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
  get statisticalSeries(): StatisticalSeries {
    return this._statisticalSeries;
  }

  private calcStatisticalSeries(): StatisticalSeries {
    return this.data.reduce((acc: StatisticalSeries, num) => {
      acc[num] = (acc[num] || 0) + 1;
      return acc;
    }, {});
  }

  private getMode(): number {
    let maxCount = 0;
    let modeValue = this.data[0];

    Object.entries(this.statisticalSeries).forEach(([key, count]) => {
      const numCount = Number(count);
      if (numCount > maxCount) {
        maxCount = numCount;
        modeValue = Number(key);
      }
    });

    return modeValue;
  }
}

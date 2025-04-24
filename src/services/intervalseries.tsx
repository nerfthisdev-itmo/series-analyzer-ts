class IntervalVariationSeries {
    private data: Array<number>
    private n: number
    private _min: number
    private _max: number

    private _intervalBorders: Array<number> | null = null
    private _statisticalSeries: Record<string, number> = {}
    private _binCenters: Array<number> | null = null
    private _expectedValue: number | null = null
    private _sampleVariance: number | null = null
    public cumulativeValues: Array<number> = []

    constructor(data: Array<number>) {
        this.data = [...data].sort((a, b) => a - b)
        this.n = data.length
        this._min = Math.min(...data)
        this._max = Math.max(...data)

        // Принудительная инициализация статистического ряда

        // Инициализация cumulativeValues
        let prev = 0
        this.cumulativeValues = []
        for (const count of Object.values(this._statisticalSeries)) {
            this.cumulativeValues.push(prev)
            prev += count
        }
    }

    get min(): number {
        return this._min
    }

    get max(): number {
        return this._max
    }

    get range(): number {
        return this.max - this.min
    }

    get intervalCount(): number {
        return Math.floor(1 + Math.log2(this.n))
    }

    get intervalLength(): number {
        return this.range / this.intervalCount
    }

    get intervalStartingPoint(): number {
        return this.min / 2
    }

    get intervalBorders(): Array<number> {
        if (!this._intervalBorders) {
            const start = this.intervalStartingPoint
            const length = this.intervalLength
            this._intervalBorders = []
            for (let i = 0; i <= this.intervalCount; i++) {
                this._intervalBorders.push(start + i * length)
            }
        }
        return this._intervalBorders
    }

    get statisticalSeries(): Record<string, number> {
        if (Object.keys(this._statisticalSeries).length === 0) {
            const series = new Array(this.intervalCount).fill(0)
            const start = this.intervalStartingPoint
            const range = this.range
            const intervalCount = this.intervalCount

            for (const num of this.data) {
                const offset = num - start
                let idx = Math.floor((offset / range) * intervalCount)
                idx = Math.min(idx, intervalCount - 1)
                series[idx]++
            }

            const borders = this.intervalBorders
            this._statisticalSeries = {}
            for (let i = 0; i < intervalCount; i++) {
                const intervalKey = `[${borders[i]}, ${borders[i + 1]})`
                this._statisticalSeries[intervalKey] = series[i]
            }
        }
        return this._statisticalSeries
    }

    get binCenters(): Array<number> {
        if (!this._binCenters) {
            const borders = this.intervalBorders
            this._binCenters = []
            for (let i = 0; i < borders.length - 1; i++) {
                this._binCenters.push((borders[i] + borders[i + 1]) / 2)
            }
        }
        return this._binCenters
    }
}

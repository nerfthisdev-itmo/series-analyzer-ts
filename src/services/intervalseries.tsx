export class IntervalVariationSeries {
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

        // init cumulative values
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

    get expectedValue(): number {
        if (this._expectedValue === null) {
            let total = 0
            const centers = this.binCenters
            const counts = Object.values(this.statisticalSeries)
            for (let i = 0; i < centers.length; i++) {
                total += centers[i] * counts[i]
            }
            this._expectedValue = total / this.n
        }
        return this._expectedValue
    }

    get sampleVariance(): number {
        if (this._sampleVariance === null) {
            const mean = this.expectedValue
            let total = 0
            const centers = this.binCenters
            const counts = Object.values(this.statisticalSeries)
            for (let i = 0; i < centers.length; i++) {
                total += (centers[i] - mean) ** 2 * counts[i]
            }
            this._sampleVariance = total / this.n
        }
        return this._sampleVariance
    }

    get sampleStandardDeviation(): number {
        return Math.sqrt(this.sampleVariance)
    }

    get mode(): number {
        const counts = Object.values(this.statisticalSeries)
        const maxCount = Math.max(...counts)
        const modalIdx = counts.indexOf(maxCount)
        const borders = this.intervalBorders

        const prevCount = modalIdx > 0 ? counts[modalIdx - 1] : 0
        const nextCount = modalIdx < counts.length - 1 ? counts[modalIdx + 1] : 0

        return (
            borders[modalIdx] +
            this.intervalLength *
            ((maxCount - prevCount) /
                (maxCount - prevCount + (maxCount - nextCount)))
        )
    }

    get median(): number {
        const counts = Object.values(this.statisticalSeries)
        const cumulative: Array<number> = []
        let total = 0
        for (const count of counts) {
            total += count
            cumulative.push(total)
        }

        const target = this.n / 2
        let medianIdx = 0
        while (medianIdx < cumulative.length && cumulative[medianIdx] < target) {
            medianIdx++
        }

        const lowerBound = this.intervalBorders[medianIdx]
        if (medianIdx === 0) {
            return lowerBound + (target / counts[medianIdx]) * this.intervalLength
        } else {
            const prevTotal = cumulative[medianIdx - 1]
            return (
                lowerBound +
                ((target - prevTotal) / counts[medianIdx]) * this.intervalLength
            )
        }
    }

    getNthMoment(moment: number): number {
        const mean = this.expectedValue
        const stdDev = this.sampleStandardDeviation
        let total = 0
        const centers = this.binCenters
        const counts = Object.values(this.statisticalSeries)

        for (let i = 0; i < centers.length; i++) {
            total += (centers[i] - mean) ** moment * counts[i]
        }
        return total / (this.n * stdDev ** moment)
    }

    getCdf(x: number): number {
        let count = 0
        for (const value of this.data) {
            if (value < x) count++
        }
        return count / this.n
    }
}

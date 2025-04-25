import { describe, expect, it } from "vitest";
import { IntervalVariationSeries } from "@/services/intervalseries";

describe("IntervalVariationSeries", () => {
    const testData = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const series = new IntervalVariationSeries(testData);

    it("should calculate basic statistics correctly", () => {
        expect(series.min).toBe(1);
        expect(series.max).toBe(9);
        expect(series.range).toBe(8);
        expect(series.n).toBe(9);
    });
});

import { describe, expect, it } from "vitest";
import { IntervalVariationSeries } from "@/services/intervalseries";

describe("IntervalVariationSeries", () => {
  const testData = [
    174, 166, 157, 161, 165, 162, 161, 164, 172, 158, 161, 163, 160, 154, 171,
    160, 168, 171, 161, 162, 168, 164, 166, 159, 172, 154, 154, 153, 159, 160,
    173, 150, 166, 157, 177, 165, 168, 152, 168, 164, 158, 153, 164, 174, 179,
    159, 165, 167, 169, 164, 168, 151, 174, 166, 169, 170, 159, 162, 153, 175,
    178, 157, 170, 174, 169, 159, 154, 165, 167, 161, 168, 157, 182, 175, 170,
    155, 164, 174, 167, 160, 159, 160, 153, 151, 169, 155, 143, 163, 155, 173,
    166, 164, 186, 161, 158, 150, 159, 167, 163, 166, 155, 149, 157, 164, 166,
    171, 172, 154, 161, 169, 164, 173, 154, 162, 171, 156, 155, 160, 156, 165,
    149, 175, 150, 162, 179, 154, 167, 158, 155, 147, 161, 161, 173, 166, 156,
    171, 158, 164, 168, 173, 166, 148, 174, 179, 173, 167, 162, 166, 167, 164,
    158, 160, 163, 161, 154, 151, 156, 150, 157, 163, 168, 170, 165, 174, 149,
    161, 162, 155, 164, 156, 157, 170, 173, 165, 160, 166, 166, 160, 165, 159,
    157, 162, 173, 173, 151, 151, 169, 167, 145, 166, 169, 161, 169, 170, 172,
    159, 161, 162, 151, 165, 161, 151, 156, 167, 148, 167, 170, 149, 162, 169,
    157,
  ];
  const series = new IntervalVariationSeries(testData);

  it("should calculate basic statistics correctly", () => {
    expect(series.min).toBe(1);
    expect(series.max).toBe(9);
    expect(series.range).toBe(8);
    expect(series.n).toBe(212);
  });

  it("should create correct statistical series", () => {
    const stats = series.statisticalSeries;

    const expectedStats = {
      "[1.0, 2.8)": 1,
      "[2.8, 4.6)": 2,
      "[4.6, 6.4)": 3,
      "[6.4, 8.2)": 2,
      "[8.2, 10.0)": 1,
    };

    expect(Object.keys(stats)).toEqual(Object.keys(expectedStats));
    expect(Object.values(stats)).toEqual(Object.values(expectedStats));
  });
});

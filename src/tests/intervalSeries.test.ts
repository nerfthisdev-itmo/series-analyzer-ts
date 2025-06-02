import { describe, expect, it } from "vitest";
import { IntervalVariationSeries } from "@/services/series/intervalSeries";

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

  it("calculate basic statistics correctly", () => {
    expect(series.min).toBe(143);
    expect(series.max).toBe(186);
    expect(series.range).toBe(43);
    expect(series.n).toBe(211);
  });

  it("calculate cumulative valuse", () => {
    expect(series.cumulativeValues).toStrictEqual([
      0, 5, 25, 70, 120, 169, 204, 209,
    ]);
  });

  it("create correct statistical series", () => {
    const stats = series.getStatisticalSeries();

    const expectedStats = {
      "[143, 148.375)": 5,
      "[148.375, 153.75)": 20,
      "[153.75, 159.125)": 45,
      "[159.125, 164.5)": 50,
      "[164.5, 169.875)": 49,
      "[169.875, 175.25)": 35,
      "[175.25, 180.625)": 5,
      "[180.625, 186)": 2,
    };

    expect(Object.keys(stats)).toEqual(Object.keys(expectedStats));
    expect(Object.values(stats)).toEqual(Object.values(expectedStats));
  });
  it("calculate expected value correctly", () => {
    const expected = 162.8824;
    expect(series.mean).toBeCloseTo(expected, 1);
  });

  it("calculate median correctly", () => {
    const expectedMedian = 162.94125;
    expect(series.median).toBeCloseTo(expectedMedian, 1);
  });

  it("calculate mode correctly", () => {
    const expectedMode = 163.6041;
    expect(series.mode).toBeCloseTo(expectedMode, 1);
  });

  it("calculate moments correctly", () => {
    const expectedMoment1 = -5.985085401411088e-16;
    const expectedMoment2 = 1;
    const expectedMoment3 = -0.0082653534;
    const expectedMoment4 = 2.5360411749;
    expect(series.getNthMoment(1)).toBeCloseTo(expectedMoment1, 1);
    expect(series.getNthMoment(2)).toBeCloseTo(expectedMoment2, 1);
    expect(series.getNthMoment(3)).toBeCloseTo(expectedMoment3, 1);
    expect(series.getNthMoment(4)).toBeCloseTo(expectedMoment4, 1);
  });

  it("calculate interval length correctly", () => {
    const intervalLength = 5.375;
    expect(series.intervalLength).toBe(intervalLength);
  });

  it("calculate kurtosis correctly", () => {
    const kurtosis = -0.4639588251;
    expect(series.kurtosis).toBeCloseTo(kurtosis);
  });
});

import { describe, expect, it } from "vitest";
import { mergeCategoriesByLowerBound } from "@/services/theoretical/pearsonsCriteria";

describe("mergeCategoriesByLowerBound", () => {
  it("merges categories when buffer meets lower bound", () => {
    const empiricalData = { 1: 5, 2: 5, 3: 5 };
    const theoreticalData = { 1: 2, 2: 3, 3: 4 };
    const lowerBound = 10;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 3]": 15,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 3]": 9,
    });
  });

  it("handles single category meeting lower bound exactly", () => {
    const empiricalData = { 1: 10 };
    const theoreticalData = { 1: 2 };
    const lowerBound = 10;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({ "1": 10 });
    expect(result.mergedTheoretical).toEqual({ "1": 2 });
  });

  it("handles buffer with multiple merges", () => {
    const empiricalData = { 1: 3, 2: 3, 3: 4, 4: 5 };
    const theoreticalData = { 1: 1, 2: 2, 3: 3, 4: 4 };
    const lowerBound = 5;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 2]": 6,
      "[3, 4]": 9,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 2]": 3,
      "[3, 4]": 7,
    });
  });

  it("handles buffer left at end with existing merged keys", () => {
    const empiricalData = { 1: 5, 2: 4 };
    const theoreticalData = { 1: 2, 2: 3 };
    const lowerBound = 5;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 2]": 9,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 2]": 5,
    });
  });

  it("handles buffer left with no previous merged keys", () => {
    const empiricalData = { 1: 4, 2: 3 };
    const theoreticalData = { 1: 2, 2: 5 };
    const lowerBound = 8;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 2]": 7,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 2]": 7,
    });
  });

  it("handles empty data", () => {
    const empiricalData = {};
    const theoreticalData = {};
    const lowerBound = 5;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({});
    expect(result.mergedTheoretical).toEqual({});
  });

  it("handles buffer that merges multiple times", () => {
    const empiricalData = { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 };
    const theoreticalData = { 1: 0.5, 2: 0.5, 3: 0.5, 4: 0.5, 5: 0.5 };
    const lowerBound = 5;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 5]": 10,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 5]": 2.5,
    });
  });

  it("merges consecutive keys correctly when merging", () => {
    const empiricalData = { 1: 3, 2: 2, 3: 5, 4: 5 };
    const theoreticalData = { 1: 1, 2: 1, 3: 1, 4: 1 };
    const lowerBound = 5;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 2]": 5,
      "3": 5,
      "4": 5,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 2]": 2,
      "3": 1,
      "4": 1,
    });
  });

  it("handles buffer with multiple entries summing exactly to lowerBound", () => {
    const empiricalData = { 1: 2, 2: 3, 3: 5 };
    const theoreticalData = { 1: 0, 2: 0, 3: 0 };
    const lowerBound = 5;

    const result = mergeCategoriesByLowerBound(
      empiricalData,
      theoreticalData,
      lowerBound,
    );

    expect(result.mergedEmpirical).toEqual({
      "[1, 2]": 5,
      "3": 5,
    });
    expect(result.mergedTheoretical).toEqual({
      "[1, 2]": 0,
      "3": 0,
    });
  });
});

import { testRegressionCoefficients } from "./testRegressionCoefficients";
import { testRegressionModel } from "./testRegressionModel";
import { testPearsonCorrelation } from "./testPearsonCorrelation";
import type { RegressionCoefficientsTestResult } from "./testRegressionCoefficients";
import type { FTestResult } from "./testRegressionModel";
import type { CorrelationTestResult } from "./testPearsonCorrelation";
import type { RegressionResult } from "../regression";
import type { AbstractSeries } from "@/services/series/AbstractSeries";

export function allRegressionTests(
  X: AbstractSeries,
  Y: AbstractSeries,
  regressionResult: RegressionResult,
): {
  correlationTests: RegressionCoefficientsTestResult;
  fTest: FTestResult;
  correlationTest: CorrelationTestResult;
} {
  const correlationTests = testRegressionCoefficients(X, Y, regressionResult);
  const fTest = testRegressionModel(X, Y, regressionResult);
  const correlationTest = testPearsonCorrelation(X, Y, regressionResult.r);

  return {
    correlationTests,
    fTest,
    correlationTest,
  };
}

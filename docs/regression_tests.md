# Тесты линейной регрессии

В каталоге `src/services/regression/tests` реализованы функции, проверяющие
статистические гипотезы для модели линейной регрессии. Они используют библиотеку
`jstat` для расчёта распределений.

## F-тест модели

Функция `testRegressionModel` вычисляет статистику F для проверки значимости
всей модели. Код находится в `testRegressionModel.ts`:

```ts
export function testRegressionModel(
  X: AbstractSeries,
  Y: AbstractSeries,
  regression: RegressionResult,
): FTestResult {
  const n = X.n;
  const predictedY = X.initial_data.map(
    (xi) => regression.b + regression.k * xi,
  );

  // SSR (Sum of Squares due to Regression)
  const ssr = predictedY.reduce((sum, yPred) => sum + (yPred - Y.mean) ** 2, 0);

  // SSE (Sum of Squared Errors)
  const sse = regression.residuals
    .map((value) => value.y)
    .reduce((sum, r) => sum + r ** 2, 0);

  // F-статистика
  const fStat = ssr / 1 / (sse / (n - 2));
  const pValue = jStat.ftest(fStat, 1, n - 2); // F-распределение

  return { fStat, pValue, dfModel: 1, dfResidual: n - 2, alpha: 0.05 };
}
```

Эта функция возвращает статистику `fStat` и p-value, которые позволяют проверить
гипотезу о значимости регрессии.

## t-тест коэффициентов

В файле `testRegressionCoefficients.ts` вычисляются t-статистики для
коэффициентов наклона `k` и смещения `b`:

```ts
export function testRegressionCoefficients(
  X: AbstractSeries,
  regression: RegressionResult,
): RegressionCoefficientsTestResult {
  const n = X.n;
  const residuals = regression.residuals.map((value) => value.y);

  // MSE (Mean Squared Error)
  const mse = residuals.reduce((sum, r) => sum + r ** 2, 0) / (n - 2);

  // SE для коэффициента k
  const sumXX = X.initial_data.reduce((sum, xi) => sum + (xi - X.mean) ** 2, 0);
  const seK = Math.sqrt(mse / sumXX);
  const tStatK = regression.k / seK;
  const pValueK = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatK), n - 2));

  // SE для коэффициента b
  const sumX2 = X.initial_data.reduce((sum, xi) => sum + xi ** 2, 0);
  const seB = Math.sqrt((mse * sumX2) / (n * sumXX));
  const tStatB = regression.b / seB;
  const pValueB = 2 * (1 - jStat.studentt.cdf(Math.abs(tStatB), n - 2));

  return {
    k_tStat: tStatK,
    k_pValue: pValueK,
    b_tStat: tStatB,
    b_pValue: pValueB,
    alpha: 0.05,
  };
}
```

Полученные значения `tStatK` и `tStatB` используются для проверки нулевых
гипотез о равенстве коэффициентов нулю.

## t-тест корреляции

Функция `testPearsonCorrelation` проверяет значимость коэффициента корреляции
Пирсона между входными данными:

```ts
export function testPearsonCorrelation(
  X: AbstractSeries,
  correlation: number,
): CorrelationTestResult {
  const n = X.n;
  const tStat = correlation * Math.sqrt((n - 2) / (1 - correlation ** 2));
  const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), n - 2));

  return { tStat, pValue, alpha: 0.05 };
}
```

### Совокупный вызов

Файл `allRegressionTests.ts` объединяет перечисленные проверки:

```ts
export function allRegressionTests(
  X: AbstractSeries,
  Y: AbstractSeries,
  regressionResult: RegressionResult,
): {
  coefficientTest: RegressionCoefficientsTestResult;
  fTest: FTestResult;
  correlationTest: CorrelationTestResult;
} {
  const coefficientTest = testRegressionCoefficients(X, regressionResult);
  const fTest = testRegressionModel(X, Y, regressionResult);
  const correlationTest = testPearsonCorrelation(X, regressionResult.r);

  return { coefficientTest, fTest, correlationTest };
}
```

Этот модуль возвращает результаты всех тестов сразу, что облегчает анализ
модели.

В совокупности данные функции обеспечивают комплексную статистическую проверку
построенной линейной регрессии.

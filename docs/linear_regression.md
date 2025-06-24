# Линейная регрессия

Этот проект включает реализацию простой линейной регрессии и вспомогательных тестов. Ниже описано, какие вычисления выполняются и где это происходит в коде.

## Исходные данные

Вводимые значения преобразуются в объекты `VariationSeries` (файл `src/services/series/variationSeries.ts`). Класс предоставляет методы для вычисления статистических характеристик ряда. Например, среднее значение, дисперсия и стандартное отклонение определены так:

```ts
  get mean(): number {
    const arrSum = this.data.reduce((sum: number, p: number) => sum + p);
    return (1 / this.n) * arrSum;
  }

  get variance(): number {
    const mean = this.mean;
    return (
      this.data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      this.data.length
    );
  }

  get standardDeviation(): number {
    return Math.sqrt(this.variance);
  }
```

## Расчёт ковариации и корреляции

В файле `src/services/regression/correlation.ts` определены функции `covariance` и `pearsonCorrelation`:

```ts
export function covariance(X: AbstractSeries, Y: AbstractSeries): number {
  if (X.n !== Y.n) throw new Error("Series must have the same length");
  const meanX = X.mean;
  const meanY = Y.mean;
  let sum = 0;
  for (let i = 0; i < X.n; i++) {
    sum += (X.initial_data[i] - meanX) * (Y.initial_data[i] - meanY);
  }
  return sum / (X.n - 1);
}

export function pearsonCorrelation(
  X: AbstractSeries,
  Y: AbstractSeries,
): number {
  const cov = covariance(X, Y);
  // use corrected one for it to not be biased
  return cov / (X.sampleStandardDeviation * Y.sampleStandardDeviation);
}
```

## Основная функция линейной регрессии

Вычисления линейной регрессии выполняются в `src/services/regression/regression.ts` функцией `linearRegression`:

```ts
export function linearRegression(
  X: AbstractSeries,
  Y: AbstractSeries,
): RegressionResult {
  if (X.n !== Y.n) throw new Error("Series must have the same length");
  const meanX = X.mean;
  const meanY = Y.mean;
  const cov = covariance(X, Y);
  const k = cov / X.variance;           // наклон (slope)
  const b = meanY - k * meanX;          // свободный член (intercept)

  const predictedY = X.initial_data.map((xi) => b + k * xi);
  const residualsValues = Y.initial_data.map((yi, i) => yi - predictedY[i]);

  const r = pearsonCorrelation(X, Y);   // коэффициент корреляции
  const R2 = r * r;                     // коэффициент детерминации

  const mae =
    (residualsValues.reduce(
      (sum, res, i) => sum + Math.abs(res / Y.initial_data[i]),
      0,
    ) /
      X.n) *
    100;

  const elasticity = k * (meanX / meanY);

  const residuals: Array<{ x: number; y: number }> = [];
  residualsValues.forEach((element, index) => {
    residuals.push({ x: X.initial_data[index], y: element });
  });

  return { b, k, r, R2, mae, elasticity, residuals };
}
```

Функция возвращает коэффициенты регрессии (`k` и `b`), корреляцию `r`, показатель `R2`, среднюю относительную ошибку `mae`, эластичность и массив остатков (разностей фактических и прогнозных значений).

## Анализ остатков

Для проверки предположений Гаусса–Маркова используется функция `analyzeResiduals` из файла `src/services/regression/gaussMarkovAssumptions.ts`:

```ts
export function analyzeResiduals(
  residuals: AbstractSeries,
): GaussMarkovResidualsResult {
  const meanResidual = residuals.mean;
  const zeroMean = Math.abs(meanResidual) < 1e-6;

  const skewness = residuals.skewness;
  const kurtosis = residuals.kurtosis;

  let dw = 0;
  for (let i = 1; i < residuals.initial_data.length; i++) {
    dw += (residuals.initial_data[i] - residuals.initial_data[i - 1]) ** 2;
  }
  const durbinWatson =
    dw / residuals.initial_data.reduce((sum, r) => sum + r ** 2, 0);

  return { zeroMean, skewness, kurtosis, durbinWatson };
}
```

Эта функция вычисляет ряд метрик остатков: проверку на нулевое среднее, асимметрию, эксцесс и статистику Дарбина–Уотсона.

## Использование в интерфейсе

Компонент `LinearRegressionPage` (`src/components/LinearRegressionPage.tsx`) получает данные, создаёт объекты `VariationSeries` и вызывает `linearRegression` для пар (X, Z) и (Y, Z). Результаты отображаются на графике `ScatterRegressionChart` и используются в тестах модели.

Таким образом, весь расчёт линейной регрессии сосредоточен в файле `src/services/regression/regression.ts`, а вспомогательные статистические функции находятся в `src/services/series` и `src/services/regression/correlation.ts`.

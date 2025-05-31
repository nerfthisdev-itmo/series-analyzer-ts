import type { IntervalVariationSeries } from "@/services/intervalSeries";
import { VariationSeries } from "@/services/variationSeries";

/** Делим исходный массив данных на две равные (или почти равные) части */
export function splitSeries(
  series: VariationSeries | IntervalVariationSeries,
): [VariationSeries, VariationSeries] {
  // исходные "сырые" данные – у VariationSeries это initial_data,
  // у IntervalVariationSeries вы их уже сохраняли в том же свойстве
  const data = series.initial_data;
  const mid = Math.floor(data.length / 2);

  const first = new VariationSeries(data.slice(0, mid));
  const second = new VariationSeries(data.slice(mid));

  return [first, second];
}

import React from "react";
import type {
  DistributionPair,
  DistributionType,
} from "@/services/types/distributions";

/** Список всех доступных распределений */
const ALL: Array<DistributionType> = [
  "normal",
  "binomial",
  "poisson",
  "laplace",
  "geometric",
  "uniform",
  "exponential",
];

type Props = {
  label: string; // подпись («Гипотезы для ряда A» …)
  value: DistributionPair; // текущая пара
  onChange: (pair: DistributionPair) => void; // callback
};

const DistributionPairSelect: React.FC<Props> = ({
  label,
  value,
  onChange,
}) => {
  /** обновляем 0-й или 1-й элемент кортежа */
  const handle = (idx: 0 | 1) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next: DistributionPair =
      idx === 0
        ? [e.target.value as DistributionType, value[1]]
        : [value[0], e.target.value as DistributionType];
    onChange(next);
  };

  return (
    <div className='flex flex-col gap-1'>
      <span className='font-medium text-zinc-500 text-xs'>{label}</span>

      {/* первый select */}
      <select
        value={value[0]}
        onChange={handle(0)}
        className='dark:bg-neutral-800 px-2 py-1 border dark:border-neutral-700 rounded-md text-sm'
      >
        {ALL.map((d) => (
          <option key={d} value={d}>
            {d.toUpperCase()}
          </option>
        ))}
      </select>

      {/* второй select */}
      <select
        value={value[1]}
        onChange={handle(1)}
        className='dark:bg-neutral-800 px-2 py-1 border dark:border-neutral-700 rounded-md text-sm'
      >
        {ALL.map((d) => (
          <option key={d} value={d}>
            {d.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DistributionPairSelect;

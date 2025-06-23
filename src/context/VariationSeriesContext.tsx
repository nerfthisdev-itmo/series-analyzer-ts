// src/context/VariationSeriesContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { getDefaultA, getDefaultB } from "./DefaultData";
import type { ReactNode } from "react";

import type { DistributionPair } from "@/services/types/distributions";
import { VariationSeries } from "@/services/series/variationSeries";
import { IntervalVariationSeries } from "@/services/series/intervalSeries";

type VariationSeriesContextType = {
  seriesA: VariationSeries | null;
  seriesB: IntervalVariationSeries | null;
  setSeries: (a: VariationSeries, b: IntervalVariationSeries) => void;

  distsA: DistributionPair;
  distsB: DistributionPair;
  setDistsA: (p: DistributionPair) => void;
  setDistsB: (p: DistributionPair) => void;
};

/* ---------- сам контекст ---------- */
const VariationSeriesContext = createContext<
  VariationSeriesContextType | undefined
>(undefined);

export const VariationSeriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  /* данные рядов */
  const [seriesA, setSeriesA] = useState<VariationSeries | null>(null);
  const [seriesB, setSeriesB] = useState<IntervalVariationSeries | null>(null);

  /* пары распределений (дефолтные) */
  const [distsA, setDistsA] = useState<DistributionPair>([
    "binomial",
    "uniform",
  ]);
  const [distsB, setDistsB] = useState<DistributionPair>(["normal", "laplace"]);

  /* сохранить ряды */
  const setSeries = (a: VariationSeries, b: IntervalVariationSeries) => {
    // Validate both series are non-empty
    if (a.initial_data.length === 0 || b.initial_data.length === 0) {
      alert("Cannot save empty data sets!");
      return;
    }

    setSeriesA(a);
    setSeriesB(b);
    localStorage.setItem("seriesA", JSON.stringify(a.initial_data));
    localStorage.setItem("seriesB", JSON.stringify(b.initial_data));
  };

  /* восстановить из localStorage */
  useEffect(() => {
    const storedA = localStorage.getItem("seriesA");
    const storedB = localStorage.getItem("seriesB");
    const sa = localStorage.getItem("distsA");
    const sb = localStorage.getItem("distsB");

    // Загрузка распределений с очисткой при ошибке
    if (sa && sb) {
      try {
        setDistsA(JSON.parse(sa));
        setDistsB(JSON.parse(sb));
      } catch {
        localStorage.removeItem("distsA");
        localStorage.removeItem("distsB");
      }
    }

    // Создаём демо-данные если нет сохранений
    const createDefaultSeries = () => {
      const discreteData = getDefaultA();
      const intervalData = getDefaultB();
      const defaultDiscrete = new VariationSeries(discreteData);
      const defaultInterval = new IntervalVariationSeries(intervalData);
      setSeries(defaultDiscrete, defaultInterval);
    };

    if (storedA && storedB) {
      try {
        // Пробуем создать ряды из сохранённых данных
        const parsedA = JSON.parse(storedA);
        const parsedB = JSON.parse(storedB);

        const loadedA = new VariationSeries(parsedA);
        const loadedB = new IntervalVariationSeries(parsedB);

        setSeriesA(loadedA);
        setSeriesB(loadedB);
      } catch (e) {
        console.warn("Ошибка загрузки рядов, используются демо-данные", e);
        // Удаляем повреждённые данные
        localStorage.removeItem("seriesA");
        localStorage.removeItem("seriesB");
        createDefaultSeries();
      }
    } else {
      createDefaultSeries(); // Первый вход - создаём демо
    }
  }, []);

  /* синхронизируем пары распределений */
  useEffect(() => {
    localStorage.setItem("distsA", JSON.stringify(distsA));
  }, [distsA]);
  useEffect(() => {
    localStorage.setItem("distsB", JSON.stringify(distsB));
  }, [distsB]);

  return (
    <VariationSeriesContext.Provider
      value={{
        seriesA,
        seriesB,
        setSeries,
        distsA,
        distsB,
        setDistsA,
        setDistsB,
      }}
    >
      {children}
    </VariationSeriesContext.Provider>
  );
};

export const useVariationSeries = () => {
  const ctx = useContext(VariationSeriesContext);
  if (!ctx) {
    throw new Error(
      "useVariationSeries must be used within a VariationSeriesProvider",
    );
  }
  return ctx;
};

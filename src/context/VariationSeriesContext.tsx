// src/context/VariationSeriesContext.tsx
import {
  createContext,
  useContext, // 👈 ДОБАВИЛИ
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { DistributionPair } from "@/services/theoretical/theoreticalTypes";
import { VariationSeries } from "@/services/variationSeries";
import { IntervalVariationSeries } from "@/services/intervalSeries";

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

    if (storedA && storedB) {
      try {
        setSeriesA(new VariationSeries(JSON.parse(storedA)));
        setSeriesB(new IntervalVariationSeries(JSON.parse(storedB)));
      } catch (e) {
        console.warn("Не удалось загрузить ряды", e);
      }
    }
    if (sa && sb) {
      try {
        setDistsA(JSON.parse(sa));
        setDistsB(JSON.parse(sb));
      } catch {
        /* ignore */
      }
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

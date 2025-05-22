import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { VariationSeries } from "@/services/variationSeries";
import { IntervalVariationSeries } from "@/services/intervalSeries";

type VariationSeriesContextType = {
  seriesA: VariationSeries | null;
  seriesB: IntervalVariationSeries | null;
  setSeries: (a: VariationSeries, b: IntervalVariationSeries) => void;
};

const VariationSeriesContext = createContext<
  VariationSeriesContextType | undefined
>(undefined);

export const VariationSeriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [seriesA, setSeriesA] = useState<VariationSeries | null>(null);
  const [seriesB, setSeriesB] = useState<IntervalVariationSeries | null>(null);

  const setSeries = (a: VariationSeries, b: IntervalVariationSeries) => {
    setSeriesA(a);
    setSeriesB(b);

    localStorage.setItem("seriesA", JSON.stringify(a.initial_data));
    localStorage.setItem("seriesB", JSON.stringify(b.initial_data));
  };

  useEffect(() => {
    const storedA = localStorage.getItem("seriesA");
    const storedB = localStorage.getItem("seriesB");

    if (storedA && storedB) {
      try {
        const aData = JSON.parse(storedA);
        const bData = JSON.parse(storedB);
        setSeriesA(new VariationSeries(aData));
        setSeriesB(new IntervalVariationSeries(bData));
      } catch (e) {
        console.warn("Не удалось загрузить сохранённые данные", e);
      }
    }
  }, []);

  return (
    <VariationSeriesContext.Provider value={{ seriesA, seriesB, setSeries }}>
      {children}
    </VariationSeriesContext.Provider>
  );
};

export const useVariationSeries = () => {
  const context = useContext(VariationSeriesContext);
  if (!context) {
    throw new Error(
      "useVariationSeries must be used within a VariationSeriesProvider",
    );
  }
  return context;
};

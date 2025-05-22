import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { VariationSeries } from "@/services/variationSeries";
import type { IntervalVariationSeries } from "@/services/intervalSeries";

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
  };

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

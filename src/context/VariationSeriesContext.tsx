import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { VariationSeries } from "@/services/variationSeries";

type VariationSeriesContextType = {
  seriesA: VariationSeries | null;
  seriesB: VariationSeries | null;
  setSeries: (a: VariationSeries, b: VariationSeries) => void;
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
  const [seriesB, setSeriesB] = useState<VariationSeries | null>(null);

  const setSeries = (a: VariationSeries, b: VariationSeries) => {
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

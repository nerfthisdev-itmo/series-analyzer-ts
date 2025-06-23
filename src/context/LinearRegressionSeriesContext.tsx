import { createContext, useContext, useEffect, useState } from "react";
import { getDefaultX, getDefaultY, getDefaultZ } from "./DefaultData";
import type { ReactNode } from "react";

import { VariationSeries } from "@/services/series/variationSeries";

type LinearRegressionSeriesContextType = {
  seriesX: VariationSeries | null;
  seriesY: VariationSeries | null;
  seriesZ: VariationSeries | null;
  setSeries: (
    x: VariationSeries,
    y: VariationSeries,
    z: VariationSeries,
  ) => void;
};

const LinearRegressionSeriesContext = createContext<
  LinearRegressionSeriesContextType | undefined
>(undefined);

export const LinearRegressionSeriesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [seriesX, setSeriesX] = useState<VariationSeries | null>(null);
  const [seriesY, setSeriesY] = useState<VariationSeries | null>(null);
  const [seriesZ, setSeriesZ] = useState<VariationSeries | null>(null);

  const setSeries = (
    x: VariationSeries,
    y: VariationSeries,
    z: VariationSeries,
  ) => {
    setSeriesX(x);
    setSeriesY(y);
    setSeriesZ(z);
    localStorage.setItem("seriesX", JSON.stringify(x.initial_data));
    localStorage.setItem("seriesY", JSON.stringify(y.initial_data));
    localStorage.setItem("seriesZ", JSON.stringify(z.initial_data));
  };

  useEffect(() => {
    const storedX = localStorage.getItem("seriesX");
    const storedY = localStorage.getItem("seriesY");
    const storedZ = localStorage.getItem("seriesZ");

    // Функция создания демо-данных
    const createDefaultSeries = () => {
      const defaultX = new VariationSeries(getDefaultX());
      const defaultY = new VariationSeries(getDefaultY());
      const defaultZ = new VariationSeries(getDefaultZ());
      setSeries(defaultX, defaultY, defaultZ);
    };

    if (storedX && storedY && storedZ) {
      try {
        setSeriesX(new VariationSeries(JSON.parse(storedX)));
        setSeriesY(new VariationSeries(JSON.parse(storedY)));
        setSeriesZ(new VariationSeries(JSON.parse(storedZ)));
      } catch (e) {
        console.warn("Ошибка загрузки рядов, используются демо-данные", e);
        createDefaultSeries();
      }
    } else {
      createDefaultSeries(); // Первый вход - создаём демо
    }
  }, []);

  return (
    <LinearRegressionSeriesContext.Provider
      value={{
        seriesX,
        seriesY,
        seriesZ,
        setSeries,
      }}
    >
      {children}
    </LinearRegressionSeriesContext.Provider>
  );
};

export const useLinearRegressionSeries = () => {
  const ctx = useContext(LinearRegressionSeriesContext);
  if (!ctx) {
    throw new Error(
      "useLinearRegressionSeries must be used within a LinearRegressionSeriesProvider",
    );
  }
  return ctx;
};

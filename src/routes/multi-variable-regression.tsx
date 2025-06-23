import { createFileRoute } from "@tanstack/react-router";
import { MultiVariableRegressionPlotPage } from "@/components/MultiVariableRegressionPlotPage";

export const Route = createFileRoute("/multi-variable-regression")({
  component: MultiVariableRegressionPlotPage,
});

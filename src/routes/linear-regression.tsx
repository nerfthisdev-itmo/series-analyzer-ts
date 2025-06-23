import { createFileRoute } from "@tanstack/react-router";
import { LinearRegressionPage } from "@/components/LinearRegressionPage";

export const Route = createFileRoute("/linear-regression")({
  component: LinearRegressionPage,
});

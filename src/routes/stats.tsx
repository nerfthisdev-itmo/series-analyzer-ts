import { createFileRoute } from "@tanstack/react-router";
import StatsPage from "@/components/StatsPage";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});

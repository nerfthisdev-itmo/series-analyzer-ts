import { createFileRoute } from "@tanstack/react-router";
import MainPage from "@/components/MainPage";

export const Route = createFileRoute("/")({
  component: MainPage,
});

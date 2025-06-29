/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from "./routes/__root";
import { Route as StatsRouteImport } from "./routes/stats";
import { Route as MultiVariableRegressionRouteImport } from "./routes/multi-variable-regression";
import { Route as LinearRegressionRouteImport } from "./routes/linear-regression";
import { Route as IndexRouteImport } from "./routes/index";

const StatsRoute = StatsRouteImport.update({
  id: "/stats",
  path: "/stats",
  getParentRoute: () => rootRouteImport,
} as any);
const MultiVariableRegressionRoute = MultiVariableRegressionRouteImport.update({
  id: "/multi-variable-regression",
  path: "/multi-variable-regression",
  getParentRoute: () => rootRouteImport,
} as any);
const LinearRegressionRoute = LinearRegressionRouteImport.update({
  id: "/linear-regression",
  path: "/linear-regression",
  getParentRoute: () => rootRouteImport,
} as any);
const IndexRoute = IndexRouteImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRouteImport,
} as any);

export interface FileRoutesByFullPath {
  "/": typeof IndexRoute;
  "/linear-regression": typeof LinearRegressionRoute;
  "/multi-variable-regression": typeof MultiVariableRegressionRoute;
  "/stats": typeof StatsRoute;
}
export interface FileRoutesByTo {
  "/": typeof IndexRoute;
  "/linear-regression": typeof LinearRegressionRoute;
  "/multi-variable-regression": typeof MultiVariableRegressionRoute;
  "/stats": typeof StatsRoute;
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport;
  "/": typeof IndexRoute;
  "/linear-regression": typeof LinearRegressionRoute;
  "/multi-variable-regression": typeof MultiVariableRegressionRoute;
  "/stats": typeof StatsRoute;
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths:
    | "/"
    | "/linear-regression"
    | "/multi-variable-regression"
    | "/stats";
  fileRoutesByTo: FileRoutesByTo;
  to: "/" | "/linear-regression" | "/multi-variable-regression" | "/stats";
  id:
    | "__root__"
    | "/"
    | "/linear-regression"
    | "/multi-variable-regression"
    | "/stats";
  fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  LinearRegressionRoute: typeof LinearRegressionRoute;
  MultiVariableRegressionRoute: typeof MultiVariableRegressionRoute;
  StatsRoute: typeof StatsRoute;
}

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/stats": {
      id: "/stats";
      path: "/stats";
      fullPath: "/stats";
      preLoaderRoute: typeof StatsRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/multi-variable-regression": {
      id: "/multi-variable-regression";
      path: "/multi-variable-regression";
      fullPath: "/multi-variable-regression";
      preLoaderRoute: typeof MultiVariableRegressionRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/linear-regression": {
      id: "/linear-regression";
      path: "/linear-regression";
      fullPath: "/linear-regression";
      preLoaderRoute: typeof LinearRegressionRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LinearRegressionRoute: LinearRegressionRoute,
  MultiVariableRegressionRoute: MultiVariableRegressionRoute,
  StatsRoute: StatsRoute,
};
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

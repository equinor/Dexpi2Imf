import React, { createContext } from "react";
import { PackageAction } from "./CommissioningPackageContextProvider.tsx";

export const CommissioningPackageDispatchContext =
  createContext<React.Dispatch<PackageAction> | null>(null);

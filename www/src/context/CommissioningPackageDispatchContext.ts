import React, { createContext } from "react";
import { PackageAction } from "../utils/Reducer.ts";

export const CommissioningPackageDispatchContext =
  createContext<React.Dispatch<PackageAction> | null>(null);

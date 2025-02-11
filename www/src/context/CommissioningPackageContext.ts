import CommissioningPackage from "../types/CommissioningPackage.ts";
import { createContext } from "react";

export interface CommissioningPackageContextProps {
  activePackage: CommissioningPackage;
  commissioningPackages: CommissioningPackage[];
}

export const CommissioningPackageContext =
  createContext<CommissioningPackageContextProps | null>(null);

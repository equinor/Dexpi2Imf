import { createContext } from "react";
import CommissioningPackageProps from "../types/CommissioningPackage.ts";

interface CommissioningPackageContextProps {
  activePackageId: number;
  commissioningPackages: CommissioningPackageProps[];
  setCommissioningPackages: React.Dispatch<
    React.SetStateAction<CommissioningPackageProps[]>
  >;
  borderIds: string[];
  setBorderIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const CommissioningPackageContext = createContext<
  CommissioningPackageContextProps | undefined
>(undefined);
export default CommissioningPackageContext;

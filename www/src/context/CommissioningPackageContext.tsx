import React, { createContext, useEffect, useState } from "react";
import CommissioningPackage from "../types/CommissioningPackage.ts";
import HighlightColors from "../enums/HighlightColors.ts";

export interface CommissioningPackageContextProps {
  activePackage: CommissioningPackage;
  setActivePackage: React.Dispatch<React.SetStateAction<CommissioningPackage>>;
  commissioningPackages: CommissioningPackage[];
  setCommissioningPackages: React.Dispatch<
    React.SetStateAction<CommissioningPackage[]>
  >;
  deleteCommissioningPackage: (packageId: string) => void;
}

const CommissioningPackageContext = createContext<
  CommissioningPackageContextProps | undefined
>(undefined);

export const CommissioningPackageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activePackage, setActivePackage] = useState<CommissioningPackage>({
    id: "asset:Package1",
    name: "Initial Package",
    color: HighlightColors.LASER_LEMON,
    boundaryIds: [],
    internalIds: [],
    nodeIds: [],
  });
  const [commissioningPackages, setCommissioningPackages] = useState<
    CommissioningPackage[]
  >([]);

  useEffect(() => {
    if (activePackage && commissioningPackages.length === 0) {
      setCommissioningPackages([activePackage]);
    }
  }, [activePackage, commissioningPackages]);

  const deleteCommissioningPackage = (packageId: string) => {
    setCommissioningPackages((prevPackages) =>
      prevPackages.filter((pkg) => pkg.id !== packageId)
    );
    if (activePackage.id === packageId) {
      setActivePackage(commissioningPackages[0]);
    }
  };

  return (
    <CommissioningPackageContext.Provider
      value={{
        activePackage,
        setActivePackage,
        commissioningPackages,
        setCommissioningPackages,
        deleteCommissioningPackage,
      }}
    >
      {children}
    </CommissioningPackageContext.Provider>
  );
};

export default CommissioningPackageContext;

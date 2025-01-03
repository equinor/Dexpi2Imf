import React, { createContext, useEffect, useState } from "react";
import CommissioningPackage from "../types/CommissioningPackage.ts";
import HighlightColors from "../enums/HighlightColors.ts";
import { deletePackageFromTripleStore } from "../utils/Triplestore.ts";

export interface CommissioningPackageContextProps {
  activePackage: CommissioningPackage;
  setActivePackage: React.Dispatch<React.SetStateAction<CommissioningPackage>>;
  commissioningPackages: CommissioningPackage[];
  setCommissioningPackages: React.Dispatch<
    React.SetStateAction<CommissioningPackage[]>
  >;
  deleteCommissioningPackage: (packageId: string) => void;
  createInitialPackage: () => CommissioningPackage;
}

const CommissioningPackageContext = createContext<
  CommissioningPackageContextProps | undefined
>(undefined);

export const createInitialPackage = (): CommissioningPackage => ({
  id: "asset:Package1",
  name: "Initial Package",
  color: HighlightColors.LASER_LEMON,
  boundaryIds: [],
  internalIds: [],
  nodeIds: [],
});

export const CommissioningPackageContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activePackage, setActivePackage] = useState<CommissioningPackage>(createInitialPackage());
  const [commissioningPackages, setCommissioningPackages] = useState<CommissioningPackage[]>([]);

  useEffect(() => {
    if (activePackage && commissioningPackages.length === 0) {
      setCommissioningPackages([activePackage]);
    }
  }, [activePackage, commissioningPackages]);

  const deleteCommissioningPackage = async (packageId: string) => {
      await deletePackageFromTripleStore(packageId);

      if (commissioningPackages.length === 1) {
      const initialPackage = createInitialPackage();
      setCommissioningPackages([initialPackage]);
      setActivePackage(initialPackage);
    } else {
      setCommissioningPackages((prevPackages) => {
        const updatedPackages = prevPackages.filter((pkg) => pkg.id !== packageId);
        if (activePackage.id === packageId) {
          setActivePackage(updatedPackages[0]);
        }
        return updatedPackages;
      });
    }

    setCommissioningPackages((prevPackages) =>
      prevPackages.map((pkg) => ({
          ...pkg,
          boundaryIds: pkg.boundaryIds.filter((id) => id !== packageId),
          internalIds: pkg.internalIds.filter((id) => id !== packageId),
          nodeIds: pkg.nodeIds.filter((id) => id !== packageId),
      }))
    );

    if (activePackage.id === packageId) {
      setActivePackage((prevPackage) => ({
          ...prevPackage,
          boundaryIds: [],
          internalIds: [],
          nodeIds: [],
      }));
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
        createInitialPackage,
      }}
    >
      {children}
    </CommissioningPackageContext.Provider>
  );
};

export default CommissioningPackageContext;

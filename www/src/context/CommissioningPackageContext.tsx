import React, { createContext, useEffect, useState } from "react";
import CommissioningPackage from "../types/CommissioningPackage.ts";
import HighlightColors from "../enums/HighlightColors.ts";
import {
  createCommissioningPackage,
  deleteCommissioningPackage,
} from "../utils/Api.ts";

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
  const initialPackage: CommissioningPackage = {
    id: "https://assetid.equinor.com/plantx#Package1",
    name: "Initial Package",
    color: HighlightColors.LASER_LEMON,
    boundaryIds: [],
    internalIds: [],
    selectedInternalIds: [],
  };

  const [activePackage, setActivePackage] =
    useState<CommissioningPackage>(initialPackage);
  const [commissioningPackages, setCommissioningPackages] = useState<
    CommissioningPackage[]
  >([]);

  const createInitialPackage = async (initialPackage: CommissioningPackage) => {
    await createCommissioningPackage(initialPackage);
  };

  useEffect(() => {
    if (activePackage && commissioningPackages.length === 0) {
      setCommissioningPackages([activePackage]);
      createInitialPackage(activePackage);
    }
  }, [activePackage, commissioningPackages]);

  const handleDeleteCommissioningPackage = async (packageId: string) => {
    await deleteCommissioningPackage(packageId);

    setCommissioningPackages((prevPackages) => {
      const updatedPackages = prevPackages.filter(
        (pkg) => pkg.id !== packageId,
      );
      if (updatedPackages.length === 0) {
        createInitialPackage(initialPackage);
        setActivePackage(initialPackage);
        return [initialPackage];
      } else {
        if (activePackage.id === packageId) {
          setActivePackage(updatedPackages[0]);
        }
        return updatedPackages;
      }
    });

    setCommissioningPackages((prevPackages) =>
      prevPackages.map((pkg) => ({
        ...pkg,
        boundaryIds: pkg.boundaryIds.filter((node) => node.id !== packageId),
        internalIds: pkg.internalIds.filter((node) => node.id !== packageId),
      })),
    );

    if (activePackage.id === packageId) {
      setActivePackage((prevPackage) => ({
        ...prevPackage,
        boundaryIds: [],
        internalIds: [],
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
        deleteCommissioningPackage: handleDeleteCommissioningPackage,
      }}
    >
      {children}
    </CommissioningPackageContext.Provider>
  );
};

export default CommissioningPackageContext;

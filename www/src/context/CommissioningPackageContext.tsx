import React, { useState, createContext } from "react";

export interface CommissioningPackageProps {
  id: string;
  idsInPackage: string[];  // Example fields, adjust to your data model
}

export interface CommissioningPackageContextProps {
  activePackageId: string;
  setActivePackageId: React.Dispatch<React.SetStateAction<string>>;
  commissioningPackages: CommissioningPackageProps[];
  setCommissioningPackages: React.Dispatch<
    React.SetStateAction<CommissioningPackageProps[]>
  >;
  boundaryIds: string[];
  setboundaryIds: React.Dispatch<React.SetStateAction<string[]>>;
  internalIds: string[];
  setInternalIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const CommissioningPackageContext = createContext<
  CommissioningPackageContextProps | undefined
>(undefined);

export const CommissioningPackageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [commissioningPackages, setCommissioningPackages] = useState<
    CommissioningPackageProps[]
  >([]);
  const [boundaryIds, setboundaryIds] = useState<string[]>([]);
  const [activePackageId, setActivePackageId] = useState<string>("");
  const [internalIds, setInternalIds] = useState<string[]>([]);

  const contextValue: CommissioningPackageContextProps = {
    activePackageId,
    setActivePackageId,
    commissioningPackages,
    setCommissioningPackages,
    boundaryIds,
    setboundaryIds,
    internalIds, 
    setInternalIds
  };

  return (
    <CommissioningPackageContext.Provider value={contextValue}>
      {children}
    </CommissioningPackageContext.Provider>
  );
};

export default CommissioningPackageContext;

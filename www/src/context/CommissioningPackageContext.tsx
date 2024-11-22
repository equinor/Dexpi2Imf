import React, { useState, createContext } from "react";

export interface CommissioningPackageProps {
  id: number;
  name: string; // Example fields, adjust to your data model
}

interface CommissioningPackageContextProps {
  activePackageId: number;
  setActivePackageId: React.Dispatch<React.SetStateAction<number>>;
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

export const CommissioningPackageProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [commissioningPackages, setCommissioningPackages] = useState<
    CommissioningPackageProps[]
  >([]);
  const [borderIds, setBorderIds] = useState<string[]>([]);
  const [activePackageId, setActivePackageId] = useState<number>(0);

  const contextValue: CommissioningPackageContextProps = {
    activePackageId,
    setActivePackageId,
    commissioningPackages,
    setCommissioningPackages,
    borderIds,
    setBorderIds,
  };

  return (
    <CommissioningPackageContext.Provider value={contextValue}>
      {children}
    </CommissioningPackageContext.Provider>
  );
};

export default CommissioningPackageContext;

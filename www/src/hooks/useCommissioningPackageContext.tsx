import { useContext } from "react";
import CommissioningPackageContext from "../context/CommissioningPackageContext.tsx";

export const useCommissioningPackageContext = () => {
  const context = useContext(CommissioningPackageContext);
  if (!context) {
    throw new Error(
      "useCommissioningPackageContext must be used within a CommissioningPackageProvider",
    );
  }
  return context;
};

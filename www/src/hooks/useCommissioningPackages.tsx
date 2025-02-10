import { useContext } from "react";
import { CommissioningPackageContext } from "../context/CommissioningPackageContext.ts";
import { CommissioningPackageDispatchContext } from "../context/CommissioningPackageDispatchContext.ts";

export const useCommissioningPackages = () => {
  const context = useContext(CommissioningPackageContext);
  const dispatch = useContext(CommissioningPackageDispatchContext);
  if (!context) {
    throw new Error(
      "useCommissioningPackages must be used within a CommissioningPackageProvider",
    );
  }
  if (!dispatch) {
    throw new Error(
      "useCommissioningPackageDispatch must be used within a CommissioningPackageProvider",
    );
  }
  return { context, dispatch };
};

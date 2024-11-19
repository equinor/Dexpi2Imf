import { useState } from "react";
import CommissioningPackageProps from "../types/CommissioningPackage.ts";
import CommissioningPackageContext from "../context/CommissioningPackageContext.ts";
import Pandid from "./Pandid.tsx";

export default function Editor() {
  const [commissioningPackages, setCommissioningPackages] = useState<
    CommissioningPackageProps[]
  >([]);
  const [borderIds, setBorderIds] = useState<string[]>([]);

  return (
    <CommissioningPackageContext.Provider
      value={{
        activePackageId: 0,
        commissioningPackages,
        setCommissioningPackages,
        borderIds,
        setBorderIds,
      }}
    >
      <Pandid />
    </CommissioningPackageContext.Provider>
  );
}

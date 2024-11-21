import { CommissioningPackageProvider } from "../context/CommissioningPackageContext.tsx";
import Pandid from "./Pandid.tsx";

export default function Editor() {
  return (
    <CommissioningPackageProvider>
      <Pandid />
    </CommissioningPackageProvider>
  );
}

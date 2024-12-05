import { CommissioningPackageProvider } from "../context/CommissioningPackageContext.tsx";
import Pandid from "./Pandid.tsx";
import Sidebar from "./Sidebar.tsx";

export default function Editor() {
  return (
    <CommissioningPackageProvider>
      <Sidebar />
      <Pandid />
    </CommissioningPackageProvider>
  );
}

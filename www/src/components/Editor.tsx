import Pandid from "./Pandid.tsx";
import EditorSidebar from "./EditorSidebar.tsx";
import { useState } from "react";
import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProvider } from "../context/CommissioningPackageContext.tsx";

export default function Editor() {
  const [activeTool, setActiveTool] = useState(Tools.BOUNDARY);
  return (
    <CommissioningPackageContextProvider>
      <EditorSidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <Pandid activeTool={activeTool} />
    </CommissioningPackageContextProvider>
  );
}

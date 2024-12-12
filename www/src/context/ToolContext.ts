import React, { createContext } from "react";
import Tools from "../enums/Tools.ts";

export interface ToolContextProps {
  activeTool: Tools;
  setActiveTool: React.Dispatch<React.SetStateAction<Tools>>;
}

const ToolContext = createContext<ToolContextProps>({
  activeTool: Tools.BOUNDARY,
  setActiveTool: () => {},
});

export default ToolContext;

import React, { createContext } from "react";
import Action from "../types/Action.ts";

export interface ActionContextProps {
  action: Action;
  setAction: React.Dispatch<React.SetStateAction<Action>>;
}

const ActionContext = createContext<ActionContextProps>({
  action: { tool: null, node: "" },
  setAction: () => {},
});

export default ActionContext;

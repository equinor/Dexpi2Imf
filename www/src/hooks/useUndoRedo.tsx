import Action from "../types/Action.ts";
import { useContext, useEffect, useRef, useState } from "react";
import ActionContext from "../context/ActionContext.ts";
import Tools from "../enums/Tools.ts";
import {
  handleAddBoundary,
  handleAddInternal,
} from "../utils/CommissioningPackageHandler.tsx";
import { useCommissioningPackageContext } from "./useCommissioningPackageContext.tsx";

export default function useUndoRedo() {
  const context = useContext(ActionContext);
  const commPckContext = useCommissioningPackageContext();

  const [history, setHistory] = useState<Action[]>([]);
  const index = useRef(-1);

  const handleUndo = async () => {
    if (index.current >= 0) {
      const action = history[index.current];
      switch (action.tool) {
        case Tools.BOUNDARY:
          await handleAddBoundary(action.node, commPckContext);
          break;
        case Tools.INSIDEBOUNDARY:
          await handleAddInternal(action.node, commPckContext);
          break;
      }
      index.current = index.current - 1;
    }
  };

  const handleRedo = async () => {
    if (index.current < history.length - 1) {
      const action = history[index.current + 1];
      switch (action.tool) {
        case Tools.BOUNDARY:
          await handleAddBoundary(action.node, commPckContext);
          break;
        case Tools.INSIDEBOUNDARY:
          await handleAddInternal(action.node, commPckContext);
          break;
      }
      index.current = index.current + 1;
    }
  };

  useEffect(() => {
    if (context.action.tool === null || context.action.node === "") return;
    index.current = index.current + 1;
    setHistory([...history.slice(0, index.current), context.action]);
  }, [context.action]);

  return { history, handleUndo, handleRedo };
}

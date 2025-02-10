import Action from "../types/Action.ts";
import { useContext, useEffect, useRef, useState } from "react";
import ActionContext from "../context/ActionContext.ts";
import Tools from "../enums/Tools.ts";
import {
  addBoundaryAction,
  addInternalAction,
} from "../utils/CommissioningPackageActions.tsx";
import { useCommissioningPackages } from "./useCommissioningPackages.tsx";

export default function useUndoRedo() {
  const actionContext = useContext(ActionContext);
  const { context, dispatch } = useCommissioningPackages();

  const [history, setHistory] = useState<Action[]>([]);
  const index = useRef(-1);

  const handleUndo = async () => {
    if (index.current >= 0) {
      const action = history[index.current];
      switch (action.tool) {
        case Tools.BOUNDARY:
          await addBoundaryAction(action.node, context, dispatch);
          break;
        case Tools.INSIDEBOUNDARY:
          await addInternalAction(action.node, context, dispatch);
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
          await addBoundaryAction(action.node, context, dispatch);
          break;
        case Tools.INSIDEBOUNDARY:
          await addInternalAction(action.node, context, dispatch);
          break;
      }
      index.current = index.current + 1;
    }
  };

  useEffect(() => {
    if (actionContext.action.tool === null || actionContext.action.node === "")
      return;
    index.current = index.current + 1;
    setHistory([...history.slice(0, index.current), actionContext.action]);
  }, [actionContext.action]);

  return { history, handleUndo, handleRedo };
}

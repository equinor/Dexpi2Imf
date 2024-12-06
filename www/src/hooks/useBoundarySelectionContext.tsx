import { useContext } from "react";
import BoundarySelectionContext from "../context/BoundarySelectionContext.tsx";

export const useBoundarySelectionContext = () => {
  const context = useContext(BoundarySelectionContext);
  if (!context) {
    throw new Error(
      "useBoundarySelectionContext must be used within a BoundarySelectionContextProvider",
    );
  }
  return context;
};

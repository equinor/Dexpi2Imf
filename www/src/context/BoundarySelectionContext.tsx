import React, { useState, createContext } from "react";

export interface BoundarySelectionContextProps {
  boundaryIds: string[];
  setboundaryIds: React.Dispatch<React.SetStateAction<string[]>>;
  internalIds: string[];
  setInternalIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const BoundarySelectionContext = createContext<
  BoundarySelectionContextProps | undefined
>(undefined);

export const BoundarySelectionContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [boundaryIds, setboundaryIds] = useState<string[]>([]);
  const [internalIds, setInternalIds] = useState<string[]>([]);

  const contextValue: BoundarySelectionContextProps = {
    boundaryIds,
    setboundaryIds,
    internalIds,
    setInternalIds,
  };

  return (
    <BoundarySelectionContext.Provider value={contextValue}>
      {children}
    </BoundarySelectionContext.Provider>
  );
};

export default BoundarySelectionContext;

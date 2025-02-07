import HighlightColors from "../enums/HighlightColors.ts";
import CommissioningPackage, {
  NodeElement,
} from "../types/CommissioningPackage.ts";
import React, { createContext, useReducer } from "react";

export interface CommissioningPackageContextProps {
  activePackageId: string;
  commissioningPackages: CommissioningPackage[];
}

export const CommissioningPackageContext =
  createContext<CommissioningPackageContextProps | null>(null);
export const CommissioningPackageDispatchContext =
  createContext<React.Dispatch<PackageAction> | null>(null);

export function CommissioningPackageProvider(children: React.ReactNode) {
  const [state, dispatch] = useReducer(
    commissioningPackageReducer,
    initialState,
  );

  return (
    <CommissioningPackageContext.Provider value={state}>
      <CommissioningPackageDispatchContext.Provider value={dispatch}>
        {children}
      </CommissioningPackageDispatchContext.Provider>
    </CommissioningPackageContext.Provider>
  );
}

const initialState = {
  commissioningPackages: [
    {
      id: "https://assetid.equinor.com/plantx#Package1",
      name: "Initial Package",
      color: HighlightColors.LASER_LEMON,
      boundaryNodes: [],
      internalNodes: [],
      selectedInternalNodes: [],
    },
  ],
  activePackageId: "https://assetid.equinor.com/plantx#Package1",
};

type PackageAction =
  | { type: "ADD_PACKAGE"; payload: CommissioningPackage }
  | { type: "DELETE_PACKAGE"; payload: string }
  | { type: "SET_ACTIVE_PACKAGE"; payload: string }
  | { type: "ADD_BOUNDARY"; payload: NodeElement }
  | { type: "REMOVE_BOUNDARY"; payload: string }
  | { type: "ADD_INTERNAL"; payload: NodeElement }
  | { type: "REMOVE_INTERNAL"; payload: string };

// This reducer function accepts the current state and an action, and returns the new state.
function commissioningPackageReducer(
  state: CommissioningPackageContextProps,
  action: PackageAction,
) {
  switch (action.type) {
    case "ADD_PACKAGE": {
      return {
        ...state,
        commissioningPackages: [...state.commissioningPackages, action.payload],
      };
    }
    case "DELETE_PACKAGE": {
      const updatedPackages = state.commissioningPackages.filter(
        (pkg) => pkg.id !== action.payload,
      );

      if (updatedPackages.length === 0) {
        return initialState;
      }

      return {
        ...state,
        packages: updatedPackages,
        activePackageId:
          state.activePackageId === action.payload
            ? updatedPackages[0].id
            : state.activePackageId,
      };
    }
    case "SET_ACTIVE_PACKAGE": {
      return {
        ...state,
        activePackageId: action.payload,
      };
    }
    case "ADD_BOUNDARY": {
      return {
        ...state,
        commissioningPackages: state.commissioningPackages.map(
          (pkg: CommissioningPackage) =>
            pkg.id === state.activePackageId
              ? {
                  ...pkg,
                  boundaryNodes: [...pkg.boundaryNodes, action.payload],
                }
              : pkg,
        ),
      };
    }
    case "REMOVE_BOUNDARY": {
      return {
        ...state,
        commissioningPackages: state.commissioningPackages.map(
          (pkg: CommissioningPackage) =>
            pkg.id === state.activePackageId
              ? {
                  ...pkg,
                  boundaryNodes: pkg.boundaryNodes.filter(
                    (node) => node.id !== action.payload,
                  ),
                }
              : pkg,
        ),
      };
    }
    case "ADD_INTERNAL": {
      return {
        ...state,
        commissioningPackages: state.commissioningPackages.map(
          (pkg: CommissioningPackage) =>
            pkg.id === state.activePackageId
              ? {
                  ...pkg,
                  selectedInternalNodes: [
                    ...pkg.selectedInternalNodes,
                    action.payload,
                  ],
                }
              : pkg,
        ),
      };
    }
    case "REMOVE_INTERNAL": {
      return {
        ...state,
        commissioningPackages: state.commissioningPackages.map(
          (pkg: CommissioningPackage) =>
            pkg.id === state.activePackageId
              ? {
                  ...pkg,
                  selectedInternalNodes: pkg.selectedInternalNodes.filter(
                    (node) => node.id !== action.payload,
                  ),
                }
              : pkg,
        ),
      };
    }
    default: {
      return state;
    }
  }
}

import HighlightColors from "../enums/HighlightColors.ts";
import CommissioningPackage from "../types/CommissioningPackage.ts";
import { ReactNode, useReducer } from "react";
import {
  CommissioningPackageContext,
  CommissioningPackageContextProps,
} from "./CommissioningPackageContext.ts";
import { CommissioningPackageDispatchContext } from "./CommissioningPackageDispatchContext.ts";

// This context provider uses a reducer, which takes in the current state and an action, and returns the new state. The reducer is defined below.
export function CommissioningPackageProvider({
  children,
}: {
  children: ReactNode;
}) {
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

const initialPackage: CommissioningPackage = {
  id: "https://assetid.equinor.com/plantx#Package1",
  name: "Initial Package",
  color: HighlightColors.LASER_LEMON,
  boundaryNodes: [],
  internalNodes: [],
  selectedInternalNodes: [],
};

const initialState = {
  commissioningPackages: [initialPackage],
  activePackage: initialPackage,
};

export type PackageAction =
  | { type: "SET_PACKAGES"; payload: CommissioningPackage[] }
  | { type: "ADD_PACKAGE"; payload: CommissioningPackage }
  | { type: "UPDATE_PACKAGE"; payload: CommissioningPackage }
  | { type: "DELETE_PACKAGE"; payload: string }
  | { type: "SET_ACTIVE_PACKAGE"; payload: CommissioningPackage };

// The reducer is nice to have when state is dependent on each other.
// For example, activePackage is dependent on commissioningPackages.
// If we were to update activePackage, we would also need to update commissioningPackages.
// The reducer makes this easy by handling all necessary updates in one place.
function commissioningPackageReducer(
  state: CommissioningPackageContextProps,
  action: PackageAction,
): CommissioningPackageContextProps {
  switch (action.type) {
    case "SET_PACKAGES": {
      return {
        ...state,
        commissioningPackages: action.payload,
        activePackage: action.payload[0],
      };
    }
    case "ADD_PACKAGE": {
      return {
        ...state,
        commissioningPackages: [...state.commissioningPackages, action.payload],
        activePackage: action.payload,
      };
    }
    case "UPDATE_PACKAGE": {
      return {
        ...state,
        commissioningPackages: state.commissioningPackages.map(
          (pkg: CommissioningPackage) =>
            pkg.id === action.payload.id ? action.payload : pkg,
        ),
        activePackage: action.payload,
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
        commissioningPackages: updatedPackages,
        activePackage:
          state.activePackage.id === action.payload
            ? updatedPackages[0]
            : state.activePackage,
      };
    }
    case "SET_ACTIVE_PACKAGE": {
      return {
        ...state,
        activePackage: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

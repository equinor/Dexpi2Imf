import CommissioningPackage from "../types/CommissioningPackage.ts";
import HighlightColors from "../enums/HighlightColors.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.ts";

export const initialPackage: CommissioningPackage = {
  id: "https://assetid.equinor.com/plantx#Package1",
  name: "Initial Package",
  color: HighlightColors.LASER_LEMON,
  boundaryNodes: [],
  internalNodes: [],
  selectedInternalNodes: [],
};

export const initialState = {
  commissioningPackages: [initialPackage],
  activePackage: initialPackage,
};

export type PackageAction =
  | { type: "SET_INITIAL" }
  | { type: "SET_PACKAGES"; payload: CommissioningPackage[] }
  | { type: "ADD_PACKAGE"; payload: CommissioningPackage }
  | { type: "UPDATE_PACKAGE"; payload: CommissioningPackage }
  | { type: "SET_ACTIVE_PACKAGE"; payload: CommissioningPackage };

// The reducer is nice to have when state is dependent on each other.
// For example, activePackage is dependent on commissioningPackages.
// If we were to update activePackage, we would also need to update commissioningPackages.
// The reducer makes this easy by handling all necessary updates in one place.
export function commissioningPackageReducer(
  state: CommissioningPackageContextProps,
  action: PackageAction,
): CommissioningPackageContextProps {
  switch (action.type) {
    case "SET_INITIAL": {
      return {
        commissioningPackages: [initialPackage],
        activePackage: initialPackage,
      };
    }
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

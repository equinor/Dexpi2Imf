import { ReactNode, useReducer } from "react";
import { CommissioningPackageContext } from "./CommissioningPackageContext.ts";
import { CommissioningPackageDispatchContext } from "./CommissioningPackageDispatchContext.ts";
import { commissioningPackageReducer, initialState } from "../utils/Reducer.ts";

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

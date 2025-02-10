import Tools from "../enums/Tools.ts";
import Action from "../types/Action.ts";
import React from "react";
import {
  getCommissioningPackage,
  updateBoundary,
  updateInternal,
} from "./Api.ts";
import CommissioningPackage from "../types/CommissioningPackage.ts";
import {
  CommissioningPackageContextProps,
  PackageAction,
} from "../context/NewCommissioningPackageContextProvider.tsx";

export default async function selectHandleFunction(
  id: string,
  context: CommissioningPackageContextProps,
  dispatch: React.Dispatch<PackageAction>,
  setAction: React.Dispatch<React.SetStateAction<Action>>,
  tool: Tools,
) {
  setAction({ tool: tool, node: id });
  switch (tool) {
    case Tools.BOUNDARY:
      return await handleAddBoundary(id, context, dispatch);
    case Tools.INSIDEBOUNDARY:
      return await handleAddInternal(id, context, dispatch);
    default:
      return await handleAddBoundary(id, context, dispatch);
  }
}

export async function handleAddInternal(
  id: string,
  context: CommissioningPackageContextProps,
  dispatch: React.Dispatch<PackageAction>,
) {
  await updateInternal(context.activePackage.id, id);
  await updateNodesInPackage(context, dispatch);
}

export async function handleAddBoundary(
  id: string,
  context: CommissioningPackageContextProps,
  dispatch: React.Dispatch<PackageAction>,
) {
  await updateBoundary(context.activePackage.id, id);
  await updateNodesInPackage(context, dispatch);
}

async function updateNodesInPackage(
  context: CommissioningPackageContextProps,
  dispatch: React.Dispatch<PackageAction>,
) {
  const commissioningPackage: CommissioningPackage =
    await getCommissioningPackage(context.activePackage.id);
  dispatch({ type: "UPDATE_PACKAGE", payload: commissioningPackage });
}

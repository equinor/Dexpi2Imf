import Tools from "../enums/Tools.ts";
import Action from "../types/Action.ts";
import React from "react";
import {
  createCommissioningPackage,
  deleteCommissioningPackage,
  getAllCommissioningPackages,
  getCommissioningPackage,
  updateBoundary,
  updateInternal,
} from "./Api.ts";
import CommissioningPackage from "../types/CommissioningPackage.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.ts";
import { initialPackage, PackageAction } from "./Reducer.ts";

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
      return await addBoundaryAction(id, context, dispatch);
    case Tools.INSIDEBOUNDARY:
      return await addInternalAction(id, context, dispatch);
    default:
      return await addBoundaryAction(id, context, dispatch);
  }
}

export async function addInternalAction(
  id: string,
  context: CommissioningPackageContextProps,
  dispatch: React.Dispatch<PackageAction>,
) {
  await updateInternal(context.activePackage.id, id);
  await updateNodesInPackage(context, dispatch);
}

export async function addBoundaryAction(
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

export async function getAllPackagesAction(
  dispatch: React.Dispatch<PackageAction>,
) {
  const commissioningPackages = await getAllCommissioningPackages();
  if (commissioningPackages.length === 0) {
    await addInitialPackageAction(dispatch);
    return;
  }
  dispatch({ type: "SET_PACKAGES", payload: commissioningPackages });
}

export async function deletePackageAction(
  packageId: string,
  dispatch: React.Dispatch<PackageAction>,
) {
  await deleteCommissioningPackage(packageId);
  await getAllPackagesAction(dispatch);
}

export async function addPackageAction(
  commissioningPackage: CommissioningPackage,
  dispatch: React.Dispatch<PackageAction>,
) {
  await createCommissioningPackage(commissioningPackage);
  dispatch({ type: "ADD_PACKAGE", payload: commissioningPackage });
}

export async function addInitialPackageAction(
  dispatch: React.Dispatch<PackageAction>,
) {
  await createCommissioningPackage(initialPackage);
  dispatch({ type: "SET_INITIAL" });
}

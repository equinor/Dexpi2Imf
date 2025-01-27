import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";
import Action from "../types/Action.ts";
import React from "react";
import {
  getCommissioningPackage,
  updateBoundary,
  updateInternal,
} from "./Api.ts";
import CommissioningPackage from "../types/CommissioningPackage.ts";

export default async function selectHandleFunction(
  id: string,
  context: CommissioningPackageContextProps,
  setAction: React.Dispatch<React.SetStateAction<Action>>,
  tool: Tools,
) {
  setAction({ tool: tool, node: id });
  switch (tool) {
    case Tools.BOUNDARY:
      return await handleAddBoundary(id, context);
    case Tools.INSIDEBOUNDARY:
      return await handleAddInternal(id, context);
    default:
      return await handleAddBoundary(id, context);
  }
}

export async function handleAddInternal(
  id: string,
  context: CommissioningPackageContextProps,
) {
  await updateInternal(context.activePackage.id, id);
  await updateNodesInPackage(context);
}

export async function handleAddBoundary(
  id: string,
  context: CommissioningPackageContextProps,
) {
  console.log(id);
  await updateBoundary(context.activePackage.id, id);
  await updateNodesInPackage(context);
}

async function updateNodesInPackage(context: CommissioningPackageContextProps) {
  const commissioningPackage: CommissioningPackage =
    await getCommissioningPackage(context.activePackage.id);
  console.log(`Updating nodes in package: ${commissioningPackage.id}`);
  context.setActivePackage(commissioningPackage);

  context.setCommissioningPackages((prevPackages) =>
    prevPackages.map((pkg) =>
      pkg.id === commissioningPackage.id ? commissioningPackage : pkg,
    ),
  );

  console.table(context.commissioningPackages);
}

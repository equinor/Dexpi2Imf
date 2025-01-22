import {
  BoundaryActions,
  BoundaryParts,
  getCommissioningPackage,
  makeSparqlAndUpdateStore,
} from "./Triplestore.ts";
import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";
import Action from "../types/Action.ts";
import React from "react";
import { addBoundary, deleteInternal } from "./Api.ts";

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
  // If element is already internal, remove it as internal
  if (context.activePackage.internalIds.includes(id)) {
    await removeNode(id, context, BoundaryParts.InsideBoundary, "internalIds");
    await removeNode(
      id,
      context,
      BoundaryParts.SelectedInternal,
      "selectedInternalIds",
    );
  } else {
    // If the clicked element is a boundary, remove it as a boundary
    if (context.activePackage.boundaryIds.includes(id)) {
      await removeNode(id, context, BoundaryParts.Boundary, "boundaryIds");
    }
    // Then, add it as an internal element
    await addNode(id, context, BoundaryParts.InsideBoundary, "internalIds");
    await addNode(
      id,
      context,
      BoundaryParts.SelectedInternal,
      "selectedInternalIds",
    );
  }
  // Then, update the nodes in package
  await updateNodesInPackage(context);
}

export async function handleAddBoundary(
  id: string,
  context: CommissioningPackageContextProps,
) {
  console.log(id);
  // If the element is already a boundary, remove it as boundary
  if (context.activePackage.boundaryIds.includes(id)) {
    await removeNode(id, context, BoundaryParts.Boundary, "boundaryIds");
  } else {
    // If it is internal, remove it as internal.
    if (context.activePackage.internalIds.includes(id)) {
      await removeNode(
        id,
        context,
        BoundaryParts.InsideBoundary,
        "internalIds",
      );
    }
    // If it is selected internal, remove it as selected internal.
    if (context.activePackage.selectedInternalIds.includes(id)) {
      await deleteInternal(context.activePackage.id, id);
    }
    // Then, add it as a boundary
    await addBoundary(context.activePackage.id, id);
  }
  // Then, update the nodes in package
  await updateNodesInPackage(context);
}

async function addNode(
  id: string,
  context: CommissioningPackageContextProps,
  part: BoundaryParts,
  key: "boundaryIds" | "internalIds" | "selectedInternalIds",
) {
  context.setActivePackage((prev) => ({
    ...prev,
    [key]: prev[key].concat(id),
  }));
  await makeSparqlAndUpdateStore(
    id,
    BoundaryActions.Insert,
    part,
    context.activePackage.id,
  );
}

async function removeNode(
  id: string,
  context: CommissioningPackageContextProps,
  part: BoundaryParts,
  key: "boundaryIds" | "internalIds" | "selectedInternalIds",
) {
  context.setActivePackage((prev) => ({
    ...prev,
    [key]: prev[key].filter((item) => item !== id),
  }));
  await makeSparqlAndUpdateStore(
    id,
    BoundaryActions.Delete,
    part,
    context.activePackage.id,
  );
}

async function updateNodesInPackage(context: CommissioningPackageContextProps) {
  const commissioningPackage = await getCommissioningPackage(
    context.activePackage.id,
  );
  context.setActivePackage((prev) => {
    const updatedPackage = {
      ...prev,
      boundaryIds: commissioningPackage.boundaryIds,
      internalIds: commissioningPackage.internalIds,
      selectedInternalIds: commissioningPackage.selectedInternalIds,
      name: commissioningPackage.name,
      color: commissioningPackage.color,
    };

    context.setCommissioningPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg,
      ),
    );

    return updatedPackage;
  });
}

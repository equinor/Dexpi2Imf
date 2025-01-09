import {
  BoundaryActions,
  BoundaryParts,
  getNodeIdsInCommissioningPackage,
  makeSparqlAndUpdateStore,
} from "./Triplestore.ts";
import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";
import Action from "../types/Action.ts";
import React from "react";

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
  } else {
    // If the clicked element is a boundary, remove it as a boundary
    if (context.activePackage.boundaryIds.includes(id)) {
      await removeNode(id, context, BoundaryParts.Boundary, "boundaryIds");
    }
    // Then, add it as an internal element
    await addNode(id, context, BoundaryParts.InsideBoundary, "internalIds");
  }
  // Then, update the nodes in package
  await updateNodesInPackage(context);
}

export async function handleAddBoundary(
  id: string,
  context: CommissioningPackageContextProps,
) {
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
    await addNode(id, context, BoundaryParts.Boundary, "boundaryIds");
  }
  // Then, update the nodes in package
  await updateNodesInPackage(context);
}

async function addNode(
  id: string,
  context: CommissioningPackageContextProps,
  part: BoundaryParts,
  key: "boundaryIds" | "internalIds",
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
  key: "boundaryIds" | "internalIds",
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
  const nodeIds = await getNodeIdsInCommissioningPackage(
    context.activePackage.id,
  );
  context.setActivePackage((prev) => {
    const updatedPackage = { ...prev, nodeIds: nodeIds };

    context.setCommissioningPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg,
      ),
    );

    return updatedPackage;
  });
}

import {
  BoundaryActions,
  BoundaryParts,
  getNodeIdsInCommissioningPackage,
  makeSparqlAndUpdateStore,
} from "./Triplestore.ts";
import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";

export default async function selectHandleFunction(
  id: string,
  context: CommissioningPackageContextProps,
  tool: Tools,
) {
  console.log("handler selector fired");
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
  console.log("Internal handler fired");
  // If element is already inside
  if (context.activePackage.internalIds.includes(id)) {
    context.setActivePackage((prev) => ({
      ...prev,
      internalIds: prev.internalIds.filter((item) => item !== id),
    }));
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Delete,
      BoundaryParts.InsideBoundary,
    );
  } else {
    // If the clicked element is a boundary, remove it as a boundary
    if (context.activePackage.boundaryIds.includes(id)) {
      context.setActivePackage((prev) => ({
        ...prev,
        boundaryIds: prev.boundaryIds.filter((item) => item !== id),
      }));
      await makeSparqlAndUpdateStore(
        id,
        BoundaryActions.Delete,
        BoundaryParts.Boundary,
      );
    }
    // Then, add it as an internal element
    context.setActivePackage((prev) => ({
      ...prev,
      internalIds: prev.internalIds.concat(id),
    }));
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Insert,
      BoundaryParts.InsideBoundary,
    );
  }

  // Then, update the internal ids to include the new node
  const nodeIds = await getNodeIdsInCommissioningPackage();
  context.setActivePackage((prev) => ({ ...prev, nodeIds: nodeIds }));

  // Lastly, update the commissioningPackages
  context.setCommissioningPackages((prevPackages) =>
    prevPackages.map((pkg) =>
      pkg.id === context.activePackage.id
        ? { ...pkg, ...context.activePackage }
        : pkg,
    ),
  );
}

export async function handleAddBoundary(
  id: string,
  context: CommissioningPackageContextProps,
) {
  console.log("Boundary handler fired");
  // If the element is already a boundary, remove it as boundary
  if (context.activePackage.boundaryIds.includes(id)) {
    context.setActivePackage((prev) => ({
      ...prev,
      boundaryIds: prev.boundaryIds.filter((item) => item !== id),
    }));
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Delete,
      BoundaryParts.Boundary,
    );
  } else {
    // If element is not already a boundary, add it as boundary.
    // If it is internal, remove it as internal.
    if (context.activePackage.internalIds.includes(id)) {
      context.setActivePackage((prev) => ({
        ...prev,
        internalIds: prev.internalIds.filter((item) => item !== id),
      }));
      await makeSparqlAndUpdateStore(
        id,
        BoundaryActions.Delete,
        BoundaryParts.InsideBoundary,
      );
    }
    context.setActivePackage((prev) => ({
      ...prev,
      boundaryIds: prev.boundaryIds.concat(id),
    }));
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Insert,
      BoundaryParts.Boundary,
    );
  }
  // Then, update the internal ids to include the new node
  const nodeIds = await getNodeIdsInCommissioningPackage();
  context.setActivePackage((prev) => ({ ...prev, internalIds: nodeIds }));

  // Lastly, update the commissioningPackages
  context.setCommissioningPackages((prevPackages) =>
    prevPackages.map((pkg) =>
      pkg.id === context.activePackage.id
        ? { ...pkg, ...context.activePackage }
        : pkg,
    ),
  );
}

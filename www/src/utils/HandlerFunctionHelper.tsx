import {
  BoundaryActions,
  BoundaryParts,
  getCommissioningPackage,
  makeSparqlAndUpdateStore,
} from "./Triplestore.ts";
import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";

export default async function selectHandleFunction(
  id: string,
  context: CommissioningPackageContextProps,
  tool: Tools,
) {
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
  // If element is already inside
  if (context.activePackage.internalIds.includes(id)) {
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Delete,
      BoundaryParts.InsideBoundary,
      context.activePackage.id,
    );
  } else {
    // If the clicked element is a boundary, remove it as a boundary
    if (context.activePackage.boundaryIds.includes(id)) {
      await makeSparqlAndUpdateStore(
        id,
        BoundaryActions.Delete,
        BoundaryParts.Boundary,
        context.activePackage.id,
      );
    }
    // Then, add it as an internal element
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Insert,
      BoundaryParts.InsideBoundary,
      context.activePackage.id,
    );
  }
  // Then, update the nodes in package
  const commissioningPackage = await getCommissioningPackage(
    context.activePackage.id,
  );
  context.setActivePackage((prev) => {
    const updatedPackage = {
      ...prev,
      boundaryIds: commissioningPackage.boundaryIds,
      internalIds: commissioningPackage.internalIds,
      name: commissioningPackage.name,
      color: commissioningPackage.color
    };

    context.setCommissioningPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg,
      ),
    );

    return updatedPackage;
  });
}

export async function handleAddBoundary(
  id: string,
  context: CommissioningPackageContextProps,
) {
  // If the element is already a boundary, remove it as boundary
  if (context.activePackage.boundaryIds.includes(id)) {
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Delete,
      BoundaryParts.Boundary,
      context.activePackage.id,
    );
  } else {
    // If element is not already a boundary, add it as boundary.
    // If it is internal, remove it as internal.
    if (context.activePackage.internalIds.includes(id)) {
      await makeSparqlAndUpdateStore(
        id,
        BoundaryActions.Delete,
        BoundaryParts.InsideBoundary,
        context.activePackage.id,
      );
    }
    await makeSparqlAndUpdateStore(
      id,
      BoundaryActions.Insert,
      BoundaryParts.Boundary,
      context.activePackage.id,
    );
  }
  // Then, update the nodes in package
  const commissioningPackage = await getCommissioningPackage(
    context.activePackage.id,
  );
  context.setActivePackage((prev) => {
    const updatedPackage = {
      ...prev,
      boundaryIds: commissioningPackage.boundaryIds,
      internalIds: commissioningPackage.internalIds,
      name: commissioningPackage.name,
      color: commissioningPackage.color
    };

    context.setCommissioningPackages((prevPackages) =>
      prevPackages.map((pkg) =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg,
      ),
    );

    return updatedPackage;
  });
}

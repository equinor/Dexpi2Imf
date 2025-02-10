import { PipingNetworkSegmentProps } from "../types/diagram/Piping.ts";
import CommissioningPackage from "../types/CommissioningPackage.ts";

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export const isBoundary = (
  id: string,
  commissioningPackage: CommissioningPackage,
) => commissioningPackage.boundaryNodes.some((node) => node.id === id);

export const isSelectedInternal = (
  id: string,
  commissioningPackage: CommissioningPackage,
) => commissioningPackage.selectedInternalNodes?.some((node) => node.id === id);

export const constructClasses = (
  id: string,
  activePackage: CommissioningPackage,
) => {
  return `${isBoundary(id, activePackage) ? "boundary" : ""} ${isSelectedInternal(id, activePackage) ? "selectedInternal" : ""}`;
};

export const findPackageOfElement = (
  packages: CommissioningPackage[],
  nodeId: string,
) => {
  return packages.find(
    (pkg) =>
      pkg.boundaryNodes?.some((node) => node.id === nodeId) ||
      pkg.internalNodes?.some((node) => node.id === nodeId),
  );
};

export const isInActivePackage = (
  commissioningPackage: CommissioningPackage | undefined,
  activePackageId: string,
) => {
  return commissioningPackage
    ? activePackageId === commissioningPackage.id
    : true;
};

// IRI CALCULATION
//TODO - remove when new graphical format implemented
export function iriFromSvgNode(id: string) {
  return `https://assetid.equinor.com/plantx#${id}`;
}

export function iriFromPiping(segment: PipingNetworkSegmentProps) {
  if (
    segment.Connection?.ToID &&
    (!segment.PipingComponent || !segment.PropertyBreak)
  ) {
    return `https://assetid.equinor.com/plantx#${segment.Connection.ToID}-node${segment.Connection.ToNode}-connector`;
  } else if (segment.PipingComponent[1]) {
    return `https://assetid.equinor.com/plantx#${segment.PipingComponent[1].ID}-node2-connector`;
  } else if (segment.Connection?.FromID) {
    return `https://assetid.equinor.com/plantx#${segment.Connection.FromID}-node${segment.Connection.FromNode}-connector`;
  } else if (segment.Connection?.ToID) {
    return `https://assetid.equinor.com/plantx#${segment.Connection!.ToID}-node${segment.Connection!.ToNode}-connector`;
  } else {
    console.error("Something went wrong with iri creation");
    return ``;
  }
}

export function setAttributes(el: Element, attrs: { [key: string]: string }) {
  Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
}

import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";
import { PipingNetworkSegmentProps } from "../types/diagram/Piping.ts";

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export const isBoundary = (
  id: string,
  context: CommissioningPackageContextProps,
) => context.activePackage.boundaryIds.includes(id);
export const isInternal = (
  id: string,
  context: CommissioningPackageContextProps,
) => context.activePackage.internalIds.includes(id);
export const isSelectedInternal = (
  id: string,
  context: CommissioningPackageContextProps,
) => context.activePackage.selectedInternalIds?.includes(id);

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

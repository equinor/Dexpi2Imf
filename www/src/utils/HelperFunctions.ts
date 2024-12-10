import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";
import { assetIri } from "./Triplestore.ts";

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
export const isInPackage = (
  id: string,
  context: CommissioningPackageContextProps,
) =>
  context.activePackage.nodeIds
    ? context.activePackage.nodeIds.includes(assetIri(id))
    : false;

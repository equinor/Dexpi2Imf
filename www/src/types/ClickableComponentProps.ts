import { assetIri } from "../utils/Triplestore.ts";
import Tools from "../enums/Tools.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";

export interface ClickableComponentProps {
  onClick: (
    id: string,
    context: CommissioningPackageContextProps,
    tool: Tools,
  ) => Promise<void>;
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

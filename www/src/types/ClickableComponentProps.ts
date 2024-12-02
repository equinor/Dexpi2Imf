import { BoundaryActions, assetIri } from "../utils/Triplestore.ts";
import { CommissioningPackageContextProps } from "../context/CommissioningPackageContext.tsx";

export interface ClickableComponentProps {
  onClick: (
    id: string,
    action: BoundaryActions,
  ) => Promise<void>;
  onShiftClick: (
    id: string,
    action: BoundaryActions
  ) => Promise<void>;
}

const isBoundary = (id: string, context: CommissioningPackageContextProps) => context.boundaryIds.includes(id);
const isInternal = (id: string, context: CommissioningPackageContextProps) => context.internalIds.includes(id);
const isInPackage = (id: string, context: CommissioningPackageContextProps) => {
  const activePackage = context.commissioningPackages.find(pkg => pkg.id === context.activePackageId);
  return activePackage?.idsInPackage.includes(assetIri(id)) || false;
}

export const getHighlightColor = (id: string, context: CommissioningPackageContextProps) => {
  let color = ""
  if (isInternal(id, context)) {
    color = "green"
  }
  else if (isBoundary(id, context)) {
    color = "red"
  }
  else if (isInPackage(id, context)) {
    color = "yellow"
  }
  return color;
}

export const handleClick = (component: ClickableComponentProps, context: CommissioningPackageContextProps, id: string) =>
  (event: React.MouseEvent) => {
    event.preventDefault()
    if (event.ctrlKey) {
      event.preventDefault();
      if (isInternal(id, context)) {
        component.onShiftClick(id, BoundaryActions.Delete);
      }
      else {
        component.onShiftClick(id, BoundaryActions.Insert);
      }
    }
    else {
      if (isBoundary(id, context)) {
        component.onClick(id, BoundaryActions.Delete);
      }
      else {
        component.onClick(id, BoundaryActions.Insert);
      }
    }
  }


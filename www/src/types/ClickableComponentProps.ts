import { BoundaryActions } from "../utils/Triplestore.ts";

export interface ClickableComponentProps {
  onClick: (
    id: string,
    action: BoundaryActions,
  ) => Promise<void>;
  onShiftClick: (
    id: string,
    action: BoundaryActions
  ) => Promise<void>;
  isInPackage: boolean;
  isBoundary: boolean;
  isInternal: boolean;
}

export const getHighlightColor = (component: ClickableComponentProps) => {
  var colors = []
  if (component.isInPackage) {
    colors.push("yellow");
  } 
  if (component.isBoundary) {
    colors.push("red");
  } 
  if (component.isInternal) {
    colors.push("green");
  }
  return colors;
}

export const handleClick = (component: ClickableComponentProps, id: string) =>
  (event: React.MouseEvent) => {
    event.preventDefault()
    if (event.ctrlKey) {
      event.preventDefault();
      if (component.isInternal) {
        component.onShiftClick(id, BoundaryActions.Delete);
      }
      else {
        component.onShiftClick(id, BoundaryActions.Insert);
      }
    }
    else {
      if (component.isBoundary) {
        component.onClick(id, BoundaryActions.Delete);
      }
      else {
        component.onClick(id, BoundaryActions.Insert);
      }
    }
  }


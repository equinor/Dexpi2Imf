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
  isBoundary: boolean;
  isInternal: boolean;
}
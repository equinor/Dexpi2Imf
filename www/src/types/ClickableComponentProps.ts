import styled from "styled-components";
import { BoundaryActions } from "../utils/Triplestore.ts";

export const StyledInternal = styled.g`
  path {
    stroke: yellow;
    stroke-width: 5;
    opacity: 0.5 ;
  }
`;

export const StyledBoundary = styled.g`
path {
  stroke: red;
  stroke-width: 5;
  opacity: 0.5 ;
}
`;

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
import HighlightColors from "../enums/HighlightColors.ts";

export default interface CommissioningPackage {
  id: string;
  name: string;
  color: HighlightColors;
  boundaryIds: NodeElement[];
  internalIds: NodeElement[];
  selectedInternalIds: NodeElement[];
}

export interface NodeElement {
  id: string;
}

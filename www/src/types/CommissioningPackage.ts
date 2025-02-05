import HighlightColors from "../enums/HighlightColors.ts";

export default interface CommissioningPackage {
  id: string;
  name: string;
  color: HighlightColors;
  boundaryNodes: NodeElement[];
  internalNodes: NodeElement[];
  selectedInternalNodes: NodeElement[];
}

export interface NodeElement {
  id: string;
}

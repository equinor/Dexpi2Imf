import HighlightColors from "../enums/HighlightColors.ts";

export default interface CommissioningPackage {
  id: string;
  name: string;
  color: HighlightColors;
  boundaryIds: Node[];
  internalIds: Node[];
  selectedInternalIds: Node[];
}

export interface Node {
  id: string;
}

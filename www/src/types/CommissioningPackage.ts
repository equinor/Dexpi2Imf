import HighlightColors from "./HighlightColors.ts";

export default interface CommissioningPackage {
  id: string;
  name: string;
  color: HighlightColors;
  boundaryIds: string[];
  internalIds: string[];
  nodeIds: string[];
}

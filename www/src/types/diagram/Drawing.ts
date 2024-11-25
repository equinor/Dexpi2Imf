import { LabelProps } from "./Common.ts";

export interface DrawingProps {
  Name: string;
  Type: string;
  Presentation: PresentationProps; // Assuming this is similar to UnitsOfMeasure.
  Extent: ExtentProps;
  Label: LabelProps[];
}

export type PresentationProps = object;

export interface XYProps {
  X: number;
  Y: number;
}

export interface ExtentProps {
  Min: XYProps;
  Max: XYProps;
}
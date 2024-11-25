import { GenericAttributesProps } from "./Common.ts";

export interface ShapeCatalogueProps {
  Name: string;
  Label: LabelShapeProps[];
  Equipment: EquipmentShapeProps[];
  Nozzle: NozzleShapeProps[];
  ProcessInstrumentationFunction: ProcessInstrumentationFunctionShapeProps[];
  PipingComponent: PipingComponentShapeProps[];
  SignalOffPageConnector: SignalOffPageConnectorShapeProps[];
  ActuatingSystemComponent: ActuatingSystemComponentShapeProps[];
  PropertyBreak: PropertyBreakShapeProps[];
  PipeSlopeSymbol: PipeSlopeSymbolShapeProps[];
}

export interface LabelShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface EquipmentShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface NozzleShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface ProcessInstrumentationFunctionShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface PipingComponentShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface SignalOffPageConnectorShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface ActuatingSystemComponentShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface PropertyBreakShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

export interface PipeSlopeSymbolShapeProps {
  ID: string;
  ComponentName: string;
  GenericAttributes: GenericAttributesProps;
}

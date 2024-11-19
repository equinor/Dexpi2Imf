import { ShapeCatalogueProps } from "./ShapeCatalogue.ts";
import {
  AssociationProps,
  ConnectionPointsProps,
  GenericAttributesProps,
  LabelProps,
  PersistentIDProps,
  PositionProps,
} from "./Common.ts";
import { DrawingProps } from "./Drawing.ts";
import { ProcessInstrumentationFunctionProps } from "./ProcessInstrumentationFunction.ts";
import { PipingNetworkSystemProps } from "./Piping.ts";
import { ActuatingSystemProps } from "./ActuatingSystem.ts";

export interface XMLProps {
  xml: { version: string; encoding: string };
  PlantModel: PlantModelProps;
}

export interface PlantModelProps {
  PlantInformation: PlantInformationProps;
  MetaData: MetaDataProps;
  PlantStructureItem: PlantStructureItemProps[];
  Equipment: EquipmentProps[];
  PipingNetworkSystem: PipingNetworkSystemProps[];
  ProcessInstrumentationFunction: ProcessInstrumentationFunctionProps[];
  ActuatingSystem: ActuatingSystemProps[];
  Drawing: DrawingProps;
  ShapeCatalogue: ShapeCatalogueProps;
}

export interface PlantInformationProps {
  Application: string;
  ApplicationVersion: string;
  Date: string;
  Discipline: string;
  Is3D: string;
  OriginatingSystem: string;
  OriginatingSystemVendor: string;
  OriginatingSystemVersion: string;
  SchemaVersion: string;
  Time: string;
  Units: string;
  UnitsOfMeasure: UnitsOfMeasureProps;
}

export type UnitsOfMeasureProps = object;

export interface MetaDataProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  GenericAttributes: GenericAttributesProps;
}

export interface PlantStructureItemProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  PersistentID: PersistentIDProps;
  GenericAttributes: GenericAttributesProps;
  Association: AssociationProps[];
}

export interface EquipmentProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  GenericAttributes: GenericAttributesProps[];
  Association: AssociationProps[];
  Nozzle: NozzleProps[];
}

export interface NozzleProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  Label: LabelProps;
  GenericAttributes: GenericAttributesProps;
  ConnectionPoints: ConnectionPointsProps;
}

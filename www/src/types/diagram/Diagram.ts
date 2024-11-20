import { ShapeCatalogueProps } from "./ShapeCatalogue.ts";
import {
  AssociationProps,
  BaseItemProps,
  ComponentItemProps,
  ConnectionPointsProps,
  GenericAttributesProps,
  LabelProps,
  PersistentIDProps,
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

export interface MetaDataProps extends BaseItemProps {
  GenericAttributes: GenericAttributesProps;
}

export interface PlantStructureItemProps extends BaseItemProps {
  GenericAttributes: GenericAttributesProps;
  Association: AssociationProps[];
  PersistentID: PersistentIDProps;
}

export interface EquipmentProps extends ComponentItemProps {
  PersistentID: PersistentIDProps;
  GenericAttributes: GenericAttributesProps[];
  Association: AssociationProps[];
  Nozzle: NozzleProps[];
}

export interface NozzleProps extends ComponentItemProps {
  PersistentID: PersistentIDProps;
  Label: LabelProps;
  GenericAttributes: GenericAttributesProps;
  ConnectionPoints: ConnectionPointsProps;
}

import {
  AssociationProps,
  CenterLineProps,
  ConnectionPointsProps,
  ConnectionProps,
  GenericAttributesProps,
  PersistentIDProps,
  PositionProps,
} from "./Common.ts";

export interface ProcessInstrumentationFunctionProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  GenericAttributes: GenericAttributesProps;
  ConnectionPoints: ConnectionPointsProps;
  Association: AssociationProps[];
  InformationFlow: InformationFlowProps[];
  ActuatingFunction: ActuatingFunctionProps;
}

export interface InformationFlowProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  PersistentID: PersistentIDProps;
  GenericAttributes: GenericAttributesProps;
  Association: AssociationProps[];
  CenterLine: CenterLineProps;
  Connection: ConnectionProps;
}

interface ActuatingFunctionProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  Association: AssociationProps[];
}

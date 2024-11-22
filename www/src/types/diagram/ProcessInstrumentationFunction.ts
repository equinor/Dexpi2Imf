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
  SignalOffPageConnector?: SignalOffPageConnectorProps;
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

export interface SignalOffPageConnectorReferenceProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  GenericAttributes: GenericAttributesProps;
}

export interface SignalOffPageConnectorProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  ConnectionPoints: ConnectionPointsProps;
  Association: AssociationProps;
  SignalOffPageConnectorReference: SignalOffPageConnectorReferenceProps;
}

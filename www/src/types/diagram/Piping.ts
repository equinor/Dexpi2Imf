import {
  AssociationProps,
  CenterLineProps,
  ConnectionPointsProps,
  ConnectionProps,
  CoordinateProps,
  GenericAttributesProps,
  PersistentIDProps,
  PositionProps,
} from "./Common.ts";

export interface PipingComponentProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName?: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  Label: LabelProps;
  GenericAttributes: GenericAttributesProps;
  ConnectionPoints: ConnectionPointsProps;
}

export interface PipingNetworkSegmentProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  GenericAttributes: GenericAttributesProps;
  CenterLine: CenterLineProps[];
  PipingComponent: PipingComponentProps[];
  Connection?: ConnectionProps;
}

export interface PipingNetworkSystemProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  PersistentID: PersistentIDProps;
  GenericAttributes: GenericAttributesProps[];
  Label: LabelProps;
  Association: AssociationProps[];
  PipingNetworkSegment: PipingNetworkSegmentProps[] | PipingNetworkSegmentProps;
}

export interface PolyLineProps {
  NumPoints: string;
  Presentation?: unknown; // There are no attributes for Presentation, it might be an empty object or hold some unspecified properties
  Coordinate: CoordinateProps[];
}

export interface LabelProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName: string;
  Position: PositionProps;
  PolyLine?: PolyLineProps;
}

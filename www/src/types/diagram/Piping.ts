import {
  AssociationProps,
  BaseItemProps,
  CenterLineProps,
  ComponentItemProps,
  ConnectionPointsProps,
  ConnectionProps,
  CoordinateProps,
  GenericAttributesProps,
  PersistentIDProps,
  PositionProps,
} from "./Common.ts";

export interface PipingComponentProps extends BaseItemProps {
  ComponentName?: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  Label: LabelProps;
  GenericAttributes: GenericAttributesProps;
  ConnectionPoints: ConnectionPointsProps;
}

export interface PipingNetworkSegmentProps extends BaseItemProps {
  GenericAttributes: GenericAttributesProps;
  CenterLine: CenterLineProps[];
  PipingComponent: PipingComponentProps[];
  PipeSlopeSymbol?: PipeSlopeSymbolProps;
  PropertyBreak?: PropertyBreakProps;
  Connection?: ConnectionProps;
}

export interface PipingNetworkSystemProps extends BaseItemProps {
  PersistentID: PersistentIDProps;
  GenericAttributes: GenericAttributesProps[];
  Label: LabelProps;
  Association: AssociationProps[];
  PipingNetworkSegment: PipingNetworkSegmentProps[] | PipingNetworkSegmentProps;
}

export interface PolyLineProps {
  NumPoints: string;
  Presentation?: unknown;
  Coordinate: CoordinateProps[];
}

export interface LabelProps extends ComponentItemProps {
  PolyLine?: PolyLineProps;
}

export interface PropertyBreakProps extends ComponentItemProps {
  PolyLine?: PolyLineProps;
  GenericAttributes: GenericAttributesProps[];
  ConnectionPoints: ConnectionPointsProps;
}

export interface PipeSlopeSymbolProps {
  ID: string;
  ComponentName: string;
  Position: PositionProps;
}

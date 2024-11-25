export interface BaseItemProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
}

export interface ComponentItemProps extends BaseItemProps {
  ComponentName: string;
  Position: PositionProps;
}

export interface PersistentIDProps {
  Context: string;
  Identifier: string;
}

export interface PositionProps {
  Location: XYZ;
  Axis: XYZ;
  Reference: XYZ;
}

interface XYZ {
  X: number;
  Y: number;
  Z: number;
}

export interface CoordinateProps {
  X: number;
  Y: number;
  Z?: number;
}

export interface AssociationProps {
  Type: string;
  ItemID: string;
}

export interface GenericAttributesProps {
  Set: string;
  Number: number;
  GenericAttribute: GenericAttributeProps[];
}

export interface GenericAttributeProps {
  Format: string;
  Type: string;
  TypeURI: string;
  Value: string;
  Name?: string;
  AttributeURI?: string;
  ValueURI?: string;
}

export interface LabelProps extends BaseItemProps {
  Text: TextProps;
}

export interface CenterLineProps {
  NumPoints: string;
  Coordinate: CoordinateProps[];
}

export interface ConnectionProps {
  FromID: string;
  FromNode: string;
  ToID: string;
  ToNode: string;
}

export interface ConnectionPointsProps {
  NumPoints: number;
  Node: NodeProps[];
}

export interface TextProps {
  String: string;
  Font: string;
  Height: number;
  Width: number;
  Justification: string;
  TextAngle?: string;
  Position: PositionProps;
}

interface NodeProps {
  ID: string;
  Type?: string;
  Position?: PositionProps;
}

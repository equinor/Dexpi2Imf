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

export interface LabelProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
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

interface TextProps {
  String: string;
  Font: string;
  Height: number;
  Width: number;
  Justification: string;
  Position: PositionProps;
}

interface NodeProps {
  ID: string;
  Type?: string;
  Position?: PositionProps;
}

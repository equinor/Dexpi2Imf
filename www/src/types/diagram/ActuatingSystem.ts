import {
  ConnectionPointsProps,
  GenericAttributesProps,
  PersistentIDProps,
  PositionProps,
} from "./Common.ts";

export interface ActuatingSystemProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  Association: AssociationProps[];
  ActuatingSystemComponent: ActuatingSystemComponentProps[];
}

export interface AssociationProps {
  Type: string;
  ItemID: string;
}

export interface ActuatingSystemComponentProps {
  ID: string;
  ComponentClass: string;
  ComponentClassURI: string;
  ComponentName?: string;
  PersistentID: PersistentIDProps;
  Position: PositionProps;
  GenericAttributes: GenericAttributesProps;
  ConnectionPoints?: ConnectionPointsProps;
}

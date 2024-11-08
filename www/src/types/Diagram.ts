export interface XMLProps {
    // @ts-ignore
    ?xml: {version: string; encoding: string};
    PlantModel: PlantModelProps;
}

export interface PlantModelProps {
    PlantInformation: PlantInformationProps;
    MetaData: MetaDataProps;
    PlantStructureItem: PlantStructureItemProps[];
    Equipment: EquipmentProps[];
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

export interface UnitsOfMeasureProps {
}

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

export interface DrawingProps {
    Name: string;
    Type: string;
    Presentation: PresentationProps; // Assuming this is similar to UnitsOfMeasure.
    Extent: ExtentProps;
    Label: LabelProps[];
}

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

export interface XYProps {
    X: number;
    Y: number;
}

export interface ExtentProps {
    Min: XYProps;
    Max: XYProps;
}

export interface PresentationProps {
    // Based on XML, there are no attributes or other nested elements defined for Presentation.
}

// The rest of the shape types (only an example given, all others would follow similar structure):
export interface LabelShapeProps {
    ID: string;
    ComponentName: string;
    GenericAttributes: GenericAttributesProps;
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

export interface XYZ {
    X: number;
    Y: number;
    Z: number;
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
    Name: string;
    AttributeURI: string;
}

export interface AssociationProps {
    Type: string;
    ItemID: string;
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

export interface LabelProps {
    ID: string;
    ComponentClass: string;
    ComponentClassURI: string;
    Text: TextProps;
}

export interface TextProps {
    String: string;
    Font: string;
    Height: number;
    Width: number;
    Justification: string;
    Position: PositionProps;
}

export interface ConnectionPointsProps {
    NumPoints: number;
    Node: NodeProps[];
}
export interface NodeProps {
    ID: string;
    Type?: string;
    Position?: PositionProps;
}

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
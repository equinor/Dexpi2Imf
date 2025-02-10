export interface PointProps {
  x: number;
  y: number;
}

export interface ExtentProps {
  min: PointProps;
  max: PointProps;
}

export interface SymbolProps {
  id: string;
  position: PositionProps;
  svg: string;
}

export interface PositionProps extends PointProps {
  rotation: number;
}

export interface LineProps {
  id: string;
  coordinates: PointProps[];
  style: LineStyleProps;
}

export interface LineStyleProps {
  strokeDasharray: string;
  strokeWidth: string;
  stroke: string;
}

export interface DiagramProps {
  diagramName: string;
  extent: ExtentProps;
  symbols: SymbolProps[];
  lines: LineProps[];
}

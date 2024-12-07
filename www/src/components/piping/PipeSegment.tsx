import CenterLine from "../CenterLine.tsx";
import {
  PipingNetworkSegmentProps,
} from "../../types/diagram/Piping.ts";
import { CenterLineProps } from "../../types/diagram/Common.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import StyledPath from "../StyledPath.tsx";
import constructPath from "../../utils/Path.ts";

export default function PipeSegment(props: PipingNetworkSegmentProps) {
  const height = useContext(PandidContext).height;
  const centerlines: CenterLineProps[] = Array.isArray(props.CenterLine)
    ? props.CenterLine
    : [props.CenterLine];


  return (
    <>
      <CenterLine centerLines={centerlines} isInformationFlow={false} />
      {props.PipeSlopeSymbol && (
        <SvgElement
          componentName={props.PipeSlopeSymbol.ComponentName}
          id={props.PipeSlopeSymbol.ID}
          position={props.PipeSlopeSymbol.Position}
        />
      )}
      {props.PropertyBreak && (
        <>
          <SvgElement
            id={props.PropertyBreak.ID}
            componentName={props.PropertyBreak.ComponentName}
            text={props.PropertyBreak.GenericAttributes[0]}
            position={props.PropertyBreak.Position}
          />
          {props.PropertyBreak.PolyLine && (
            <StyledPath
              d={constructPath(props.PropertyBreak.PolyLine.Coordinate, height)}
              $isDashed={false}
            />
          )}
        </>
      )}
      {props.PipeOffPageConnector && (
        <SvgElement
          componentName={props.PipeOffPageConnector.ComponentName}
          id={props.PipeOffPageConnector.ID}
          position={props.PipeOffPageConnector.Position}
          text={
            props.PipeOffPageConnector.PipeOffPageConnectorReference
              .GenericAttributes
          }
        />
      )}
    </>
  );
}

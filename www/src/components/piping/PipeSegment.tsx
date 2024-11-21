import CenterLine from "../CenterLine.tsx";
import {
  PipeOffPageConnectorProps,
  PipingComponentProps,
  PipingNetworkSegmentProps,
} from "../../types/diagram/Piping.ts";
import {
  CenterLineProps,
  GenericAttributesProps,
} from "../../types/diagram/Common.ts";
import PipingComponent from "./PipingComponent.tsx";
import PipeSlopeComponent from "./PipeSlopeComponent.tsx";
import PropertyBreak from "./PropertyBreak.tsx";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";

function PipeOffPageConnector(props: PipeOffPageConnectorProps) {
  const genericAttributes: GenericAttributesProps[] = Array.isArray(
    props.PipeOffPageConnectorReference.GenericAttributes,
  )
    ? props.PipeOffPageConnectorReference.GenericAttributes
    : [props.PipeOffPageConnectorReference.GenericAttributes];
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(props.ComponentName, genericAttributes[0]);
  return (
    <>
      {svg && (
        <g
          transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </>
  );
}

export default function PipeSegment(props: PipingNetworkSegmentProps) {
  const centerlines: CenterLineProps[] = Array.isArray(props.CenterLine)
    ? props.CenterLine
    : [props.CenterLine];
  const pipingComponents: PipingComponentProps[] = Array.isArray(
    props.PipingComponent,
  )
    ? props.PipingComponent
    : [props.PipingComponent];

  return (
    <>
      <CenterLine centerLines={centerlines} isInformationFlow={false} />
      {pipingComponents &&
        pipingComponents[0] !== undefined &&
        pipingComponents.map(
          (pipingComponent: PipingComponentProps, index: number) => (
            <PipingComponent key={index} {...pipingComponent} />
          ),
        )}
      {props.PipeSlopeSymbol && (
        <PipeSlopeComponent {...props.PipeSlopeSymbol} />
      )}
      {props.PropertyBreak && <PropertyBreak {...props.PropertyBreak} />}
      {props.PipeOffPageConnector && (
        <PipeOffPageConnector {...props.PipeOffPageConnector} />
      )}
    </>
  );
}

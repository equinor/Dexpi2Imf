import CenterLine from "../CenterLine.tsx";
import {
  PipingComponentProps,
  PipingNetworkSegmentProps,
} from "../../types/diagram/Piping.ts";
import { CenterLineProps } from "../../types/diagram/Common.ts";
import PipingComponent from "./PipingComponent.tsx";
import PipeSlopeComponent from "./PipeSlopeComponent.tsx";
import PropertyBreak from "./PropertyBreak.tsx";

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
    </>
  );
}

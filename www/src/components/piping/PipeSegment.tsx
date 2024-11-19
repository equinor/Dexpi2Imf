import CenterLine from "../CenterLine.tsx";
import {
  PipingComponentProps,
  PipingNetworkSegmentProps,
} from "../../types/diagram/Piping.ts";
import { CenterLineProps } from "../../types/diagram/Common.ts";
import PipingComponent from "./PipingComponent.tsx";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";

export default function PipeSegment(props: PipingNetworkSegmentProps) {
  const context = useContext(PandidContext);
  const height = context.height;
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
      <CenterLine
        centerLines={centerlines}
        height={height}
        isInformationFlow={false}
      />
      {pipingComponents &&
        pipingComponents[0] !== undefined &&
        pipingComponents.map(
          (pipingComponent: PipingComponentProps, index: number) => (
            <PipingComponent key={index} {...pipingComponent} />
          ),
        )}
    </>
  );
}

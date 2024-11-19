import PipeSegment from "./PipeSegment.tsx";
import {
  PipingNetworkSegmentProps,
  PipingNetworkSystemProps,
} from "../../types/diagram/Piping.ts";

export default function PipeSystem(props: PipingNetworkSystemProps) {
  const pipingSegments: PipingNetworkSegmentProps[] = Array.isArray(
    props.PipingNetworkSegment,
  )
    ? props.PipingNetworkSegment
    : [props.PipingNetworkSegment];
  return (
    <>
      {pipingSegments.map((pipe: PipingNetworkSegmentProps, index: number) => (
        <PipeSegment key={index} {...pipe} />
      ))}
    </>
  );
}

import {PipingNetworkSegmentProps, PipingNetworkSystemProps} from "../types/Diagram.ts";
import PipeSegment from "./PipeSegment.tsx";

export default function PipeSystem(props: PipingNetworkSystemProps) {
    const pipingSegments: PipingNetworkSegmentProps[] = Array.isArray(props.PipingNetworkSegment)
        ? props.PipingNetworkSegment
        : [props.PipingNetworkSegment];
    return (
        <>
            {pipingSegments.map((pipe: PipingNetworkSegmentProps, index: number) => <PipeSegment key={index} {...pipe} height={props.height}/>)}
        </>);
}
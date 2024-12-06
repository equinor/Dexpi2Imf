import {
  PipingNetworkSegmentProps,
  PipingNetworkSystemProps,
} from "../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import {
  GenericAttributesProps,
  PositionProps,
} from "../../types/diagram/Common.ts";
import useSerializePipeSvg from "../../hooks/useSerializePipeSvg.tsx";
import { ensureArray } from "../../utils/HelperFunctions.ts";
import PipeSegment from "./PipeSegment.tsx";
import { ClickableComponentProps } from "../../types/ClickableComponentProps.ts";

interface PipeSystemSVGProps {
  id: string;
  componentName: string;
  genericAttributes: GenericAttributesProps;
  height: number;
  position: PositionProps;
}

function PipeSystemSVG({
  id,
  componentName,
  genericAttributes,
  position,
}: PipeSystemSVGProps) {
  const height = useContext(PandidContext).height;
  const serializedSvg = useSerializePipeSvg(
    componentName,
    genericAttributes,
    height,
    position,
  );

  return (
    <>
      {serializedSvg && (
        <g
          id={id}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: serializedSvg }}
        />
      )}
    </>
  );
}

interface PipeSystemProps
  extends PipingNetworkSystemProps,
    ClickableComponentProps {}

export default function PipeSystem(props: PipeSystemProps) {
  const height = useContext(PandidContext).height;

  return (
    <>
      {props.Label && (
        <PipeSystemSVG
          id={props.ID}
          componentName={props.Label.ComponentName}
          genericAttributes={props.GenericAttributes[0]}
          position={props.Label.Position}
          height={height}
        />
      )}
      {ensureArray(props.PipingNetworkSegment).map(
        (pipingNetworkSegment: PipingNetworkSegmentProps, index: number) => (
          <PipeSegment
            key={index}
            onClick={props.onClick}
            {...pipingNetworkSegment}
          />
        ),
      )}
    </>
  );
}

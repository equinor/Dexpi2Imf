import {
  PipingNetworkSystemProps,
} from "../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import {
  GenericAttributesProps,
  PositionProps,
} from "../../types/diagram/Common.ts";
import useSerializePipeSvg from "../../hooks/useSerializePipeSvg.tsx";

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

export default function PipeSystem(props: PipingNetworkSystemProps) {
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
    </>
  );
}

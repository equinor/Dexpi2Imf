import {
  PipingNetworkSegmentProps,
  PipingNetworkSystemProps,
} from "../../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../../context/PandidContext.ts";
import {
  GenericAttributesProps,
  PositionProps,
} from "../../../types/diagram/Common.ts";
import useSerializePipeSvg from "../../../hooks/useSerializePipeSvg.tsx";
import { ensureArray, iriFromSvgNode } from "../../../utils/HelperFunctions.ts";
import PipeSegment from "./PipeSegment.tsx";
import selectHandleFunction from "../../../utils/HandlerFunctionHelper.tsx";
import ToolContext from "../../../context/ToolContext.ts";
import { useCommissioningPackageContext } from "../../../hooks/useCommissioningPackageContext.tsx";

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
  const context = useCommissioningPackageContext();
  const tool = useContext(ToolContext).activeTool;
  const iri = iriFromSvgNode(props.ID);

  return (
    <g>
      {props.Label && (
        <PipeSystemSVG
          id={iri}
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
            onClick={() => selectHandleFunction(iri, context, tool)}
            {...pipingNetworkSegment}
          />
        ),
      )}
    </g>
  );
}

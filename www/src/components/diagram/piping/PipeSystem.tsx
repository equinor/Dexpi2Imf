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
import selectHandleFunction from "../../../utils/CommissioningPackageHandler.tsx";
import ToolContext from "../../../context/ToolContext.ts";
import { useCommissioningPackages } from "../../../hooks/useCommissioningPackages.tsx";
import ActionContext from "../../../context/ActionContext.ts";

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
  const { context, dispatch } = useCommissioningPackages();
  const setAction = useContext(ActionContext).setAction;
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
            onClick={() =>
              selectHandleFunction(iri, context, dispatch, setAction, tool)
            }
            {...pipingNetworkSegment}
          />
        ),
      )}
    </g>
  );
}

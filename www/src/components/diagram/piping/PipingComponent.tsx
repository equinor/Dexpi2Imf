import { PipingComponentProps } from "../../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import constructPath from "../../../utils/Path.ts";
import StyledPath from "../StyledPath.tsx";
import useSerializeNodeSvg from "../../../hooks/useSerializeNodeSvg.tsx";
import StyledSvgElement from "../StyledSvgElement.tsx";
import { useCommissioningPackageContext } from "../../../hooks/useCommissioningPackageContext.tsx";
import {
  GenericAttributesProps,
  PositionProps,
} from "../../../types/diagram/Common.ts";
import HighlightColors from "../../../enums/HighlightColors.ts";
import { iriFromSvgNode } from "../../../utils/HelperFunctions.ts";
import selectHandleFunction from "../../../utils/HandlerFunctionHelper.tsx";
import ToolContext from "../../../context/ToolContext.ts";

interface PipingComponentSVGProps {
  id: string;
  componentName: string;
  genericAttributes: GenericAttributesProps;
  position?: PositionProps;
  color: HighlightColors | undefined;
}

function PipingComponentSVG({
  id,
  componentName,
  genericAttributes,
  position,
  color,
}: PipingComponentSVGProps) {
  const svg = useSerializeNodeSvg(componentName, genericAttributes);

  return (
    <>
      {color && (
        <StyledSvgElement
          id={id + "_highlight"}
          position={position}
          svg={svg}
          color={color}
        />
      )}

      <SvgElement
        id={id}
        componentName={componentName}
        position={position}
        text={genericAttributes}
      />
    </>
  );
}

export default function PipingComponent(props: PipingComponentProps) {
  const height = useContext(PandidContext).height;
  const context = useCommissioningPackageContext();
  const tool = useContext(ToolContext).activeTool;

  const componentName = props.ComponentName;
  const label = props.Label;

  const iri = iriFromSvgNode(props.ID);
  const commissioningPackage = context.commissioningPackages.find((pkg) =>
    pkg.nodeIds.find((node) => node === iri),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;
  const color = commissioningPackage?.color;

  return (
    <g
      onClick={() =>
        isInActivePackage ? selectHandleFunction(props.ID, context, tool) : {}
      }
    >
      {componentName && (
        <PipingComponentSVG
          id={props.ID}
          componentName={componentName}
          position={props.Position}
          genericAttributes={props.GenericAttributes}
          color={color}
        />
      )}
      {label && (
        <>
          {label.PolyLine && (
            <StyledPath
              d={constructPath(label.PolyLine.Coordinate, height)}
              $isDashed={false}
            />
          )}
        </>
      )}
    </g>
  );
}

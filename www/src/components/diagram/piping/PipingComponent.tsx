import { PipingComponentProps } from "../../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import constructPath from "../../../utils/Path.ts";
import StyledPath from "../StyledPath.tsx";
import { useCommissioningPackageContext } from "../../../hooks/useCommissioningPackageContext.tsx";
import { iriFromSvgNode } from "../../../utils/HelperFunctions.ts";
import selectHandleFunction from "../../../utils/HandlerFunctionHelper.tsx";
import ToolContext from "../../../context/ToolContext.ts";

export default function PipingComponent(props: PipingComponentProps) {
  const height = useContext(PandidContext).height;
  const context = useCommissioningPackageContext();
  const tool = useContext(ToolContext).activeTool;

  const componentName = props.ComponentName;
  const label = props.Label;

  const iri = iriFromSvgNode(props.ID);
  const commissioningPackage = context.commissioningPackages.find((pkg) =>
    pkg.boundaryIds.includes(iri) || pkg.internalIds.includes(iri),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;

  return (
    <g
      onClick={() =>
        isInActivePackage ? selectHandleFunction(iri, context, tool) : {}
      }
    >
      {componentName && (
        <SvgElement
          id={props.ID}
          componentName={componentName}
          position={props.Position}
          text={props.GenericAttributes}
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

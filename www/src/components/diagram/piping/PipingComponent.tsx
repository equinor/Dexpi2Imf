import { PipingComponentProps } from "../../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import constructPath from "../../../utils/Path.ts";
import StyledPath from "../StyledPath.tsx";
import { useCommissioningPackages } from "../../../hooks/useCommissioningPackages.tsx";
import { iriFromSvgNode } from "../../../utils/HelperFunctions.ts";
import selectHandleFunction from "../../../utils/CommissioningPackageHandler.tsx";
import ToolContext from "../../../context/ToolContext.ts";
import ActionContext from "../../../context/ActionContext.ts";

export default function PipingComponent(props: PipingComponentProps) {
  const height = useContext(PandidContext).height;
  const { context, dispatch } = useCommissioningPackages();
  const setAction = useContext(ActionContext).setAction;
  const tool = useContext(ToolContext).activeTool;

  const componentName = props.ComponentName;
  const label = props.Label;

  const iri = iriFromSvgNode(props.ID);
  const commissioningPackage = context.commissioningPackages.find(
    (pkg) =>
      pkg.boundaryNodes?.some((node) => node.id === iri) ||
      pkg.internalNodes?.some((node) => node.id === iri),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;

  return (
    <g
      onClick={() =>
        isInActivePackage
          ? selectHandleFunction(iri, context, dispatch, setAction, tool)
          : {}
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

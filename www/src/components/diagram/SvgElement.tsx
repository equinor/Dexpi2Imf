import {
  GenericAttributesProps,
  LabelProps,
  PositionProps,
} from "../../types/diagram/Common.ts";
import calculateAngleAndRotation from "../../utils/Transformation.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";

import StyledSvgElement from "./StyledSvgElement.tsx";
import selectHandleFunction from "../../utils/CommissioningPackageActions.tsx";
import ToolContext from "../../context/ToolContext.ts";
import {
  constructClasses,
  findPackageOfElement,
  iriFromSvgNode,
  isInActivePackage,
} from "../../utils/HelperFunctions.ts";
import ActionContext from "../../context/ActionContext.ts";

interface SvgElementProps {
  id: string;
  componentName: string;
  position?: PositionProps;
  label?: LabelProps;
  rotationAttribute?: string;
  text?: GenericAttributesProps;
}

//TODO - remove when new graphical format implemented
export default function SvgElement({
  id,
  componentName,
  position,
  label,
  text,
}: SvgElementProps) {
  const height = useContext(PandidContext).height;
  const { context, dispatch } = useCommissioningPackages();
  const setAction = useContext(ActionContext).setAction;
  const tool = useContext(ToolContext).activeTool;
  const svg = useSerializeNodeSvg({
    id: id,
    componentName: componentName,
    label: label,
    genericAttributes: text,
  });
  const iri = iriFromSvgNode(id);
  const commissioningPackage = findPackageOfElement(
    context.commissioningPackages,
    iri,
  );
  const inActivePackage = isInActivePackage(
    commissioningPackage,
    context.activePackage.id,
  );
  const color = commissioningPackage?.color;
  return (
    <>
      {svg && (
        <>
          {color && (
            <StyledSvgElement
              id={iri}
              svg={svg}
              color={color}
              position={position}
            />
          )}
          <g
            id={iri}
            onClick={() =>
              inActivePackage
                ? selectHandleFunction(iri, context, dispatch, setAction, tool)
                : {}
            }
            transform={
              position
                ? calculateAngleAndRotation(
                    position.Reference.X,
                    position.Reference.Y,
                    position.Location.X,
                    height - position.Location.Y,
                  )
                : ""
            }
            className={constructClasses(iri, context.activePackage)}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </>
      )}
    </>
  );
}

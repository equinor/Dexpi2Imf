import {
  GenericAttributesProps,
  PositionProps,
} from "../../types/diagram/Common.ts";
import calculateAngleAndRotation from "../../utils/Transformation.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import {
  iriFromSvgNode,
  isBoundary,
  isInternal,
} from "../../utils/HelperFunctions.ts";
import StyledSvgElement from "./StyledSvgElement.tsx";
import selectHandleFunction from "../../utils/HandlerFunctionHelper.tsx";
import ToolContext from "../../context/ToolContext.ts";

interface SvgElementProps {
  id: string;
  componentName: string;
  position?: PositionProps;
  text?: GenericAttributesProps;
}

export default function SvgElement({
  id,
  componentName,
  position,
  text,
}: SvgElementProps) {
  const height = useContext(PandidContext).height;
  const context = useCommissioningPackageContext();
  const tool = useContext(ToolContext).activeTool;
  const svg = useSerializeNodeSvg(componentName, text);
  const iri = iriFromSvgNode(id);
  const commissioningPackage = context.commissioningPackages.find((pkg) =>
    pkg.nodeIds.find((node) => node === iri),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;
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
              isInActivePackage ? selectHandleFunction(iri, context, tool) : {}
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
            className={`.node ${isBoundary(iri, context) ? "boundary" : ""} ${isInternal(iri, context) ? "internal" : ""}`}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </>
      )}
    </>
  );
}

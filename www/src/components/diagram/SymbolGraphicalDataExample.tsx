import { useContext } from "react";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import { isBoundary, isSelectedInternal } from "../../utils/HelperFunctions.ts";
import ToolContext from "../../context/ToolContext.ts";
import selectHandleFunction from "../../utils/CommissioningPackageHandler.tsx";
import ActionContext from "../../context/ActionContext.ts";
import { SymbolProps } from "../../types/diagram/GraphicalDataFormatTestTypes.ts";
import styled from "styled-components";

const StyledG = styled.g`
  path {
    stroke: ${(props) => props.color};
    stroke-width: 5;
    opacity: 1;
  }
`;

export default function Symbol(props: SymbolProps) {
  const context = useCommissioningPackageContext();
  const setAction = useContext(ActionContext).setAction;
  const tool = useContext(ToolContext).activeTool;
  const commissioningPackage = context.commissioningPackages.find(
    (pkg) =>
      pkg.boundaryNodes?.some((node) => node.id === props.id) ||
      pkg.internalNodes?.some((node) => node.id === props.id),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;
  const color = commissioningPackage?.color;

  return (
    <g
      onClick={() =>
        isInActivePackage
          ? selectHandleFunction(props.id, context, setAction, tool)
          : {}
      }
    >
      <StyledG
        id={props.id + "_highlight"}
        color={color ? color : "white"}
        opacity={color ? 1 : 0}
        transform={`rotate(${props.position.rotation}) translate(${props.position.x}, ${props.position.y})`}
        className={`.node ${isBoundary(props.id, context) ? "boundary" : ""} ${isSelectedInternal(props.id, context) ? "selectedInternal" : ""}`}
        dangerouslySetInnerHTML={{ __html: props.svg }}
      />
      <g
        id={props.id}
        transform={`rotate(${props.position.rotation}) translate(${props.position.x}, ${props.position.y})`}
        className={`.node ${isBoundary(props.id, context) ? "boundary" : ""} ${isSelectedInternal(props.id, context) ? "selectedInternal" : ""}`}
        dangerouslySetInnerHTML={{ __html: props.svg }}
      />
    </g>
  );
}

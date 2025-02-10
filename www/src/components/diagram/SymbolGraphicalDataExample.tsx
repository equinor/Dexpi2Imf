import { useContext } from "react";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import {
  constructClasses,
  findPackageOfNode,
  isInActivePackage,
} from "../../utils/HelperFunctions.ts";
import ToolContext from "../../context/ToolContext.ts";
import selectHandleFunction from "../../utils/CommissioningPackageActions.tsx";
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
  const { context, dispatch } = useCommissioningPackages();
  const setAction = useContext(ActionContext).setAction;
  const tool = useContext(ToolContext).activeTool;

  const commissioningPackage = findPackageOfNode(
    context.commissioningPackages,
    props.id,
  );
  const activePackage = isInActivePackage(
    commissioningPackage,
    context.activePackage.id,
  );
  const color = commissioningPackage?.color;

  return (
    <g
      onClick={() =>
        activePackage
          ? selectHandleFunction(props.id, context, dispatch, setAction, tool)
          : {}
      }
    >
      <StyledG
        id={props.id + "_highlight"}
        color={color ? color : "white"}
        opacity={color ? 1 : 0}
        transform={`rotate(${props.position.rotation}) translate(${props.position.x}, ${props.position.y})`}
        className={constructClasses(props.id, context.activePackage)}
        dangerouslySetInnerHTML={{ __html: props.svg }}
      />
      <g
        id={props.id}
        transform={`rotate(${props.position.rotation}) translate(${props.position.x}, ${props.position.y})`}
        className={constructClasses(props.id, context.activePackage)}
        dangerouslySetInnerHTML={{ __html: props.svg }}
      />
    </g>
  );
}

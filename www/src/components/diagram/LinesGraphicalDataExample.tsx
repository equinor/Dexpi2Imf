import { useContext } from "react";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import ToolContext from "../../context/ToolContext.ts";
import ActionContext from "../../context/ActionContext.ts";
import {
  LineProps,
  PointProps,
} from "../../types/diagram/GraphicalDataFormatTestTypes.ts";
import selectHandleFunction from "../../utils/CommissioningPackageHandler.tsx";
import { isBoundary, isSelectedInternal } from "../../utils/HelperFunctions.ts";

function constructLine(coordinates: PointProps[]) {
  let dString = "M ";
  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    dString += `${coordinate.x} ${coordinate.y}`;
    if (i !== coordinates.length - 1) {
      dString += ` L `;
    }
  }
  return dString;
}

export default function Line({ id, style, coordinates }: LineProps) {
  const { context, dispatch } = useCommissioningPackages();
  const setAction = useContext(ActionContext).setAction;
  const tool = useContext(ToolContext).activeTool;
  const commissioningPackage = context.commissioningPackages.find(
    (pkg) =>
      pkg.boundaryNodes?.some((node) => node.id === id) ||
      pkg.internalNodes?.some((node) => node.id === id),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;
  const color = commissioningPackage?.color;

  function calculateLineColor() {
    if (isBoundary(id, context.activePackage)) {
      return "green";
    } else if (isSelectedInternal(id, context.activePackage)) {
      return "red";
    } else {
      return style.stroke;
    }
  }

  function calculateLineWeight() {
    if (
      isBoundary(id, context.activePackage) ||
      isSelectedInternal(id, context.activePackage)
    ) {
      return 0.6;
    } else {
      return style.strokeWidth;
    }
  }
  return (
    <g
      onClick={() =>
        isInActivePackage
          ? selectHandleFunction(id, context, dispatch, setAction, tool)
          : {}
      }
    >
      <path
        id={id}
        key={id + "_highlight"}
        d={constructLine(coordinates)}
        stroke={color ? color : "white"}
        opacity={color ? 1 : 0}
        strokeWidth={5}
        strokeDasharray={style.strokeDasharray}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={"none"}
      />
      <path
        id={id}
        key={id}
        d={constructLine(coordinates)}
        stroke={calculateLineColor()}
        strokeWidth={calculateLineWeight()}
        strokeDasharray={style.strokeDasharray}
        className={`${isBoundary(id, context.activePackage) ? "boundary" : ""} ${isSelectedInternal(id, context.activePackage) ? "selectedInternal" : ""}`}
        fill={"none"}
      />
    </g>
  );
}

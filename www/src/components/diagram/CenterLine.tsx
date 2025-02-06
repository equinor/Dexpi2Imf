import { CenterLineProps } from "../../types/diagram/Common.ts";
import constructPath from "../../utils/Path.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import StyledPath from "./StyledPath.tsx";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import React from "react";
import selectHandleFunction from "../../utils/CommissioningPackageHandler.tsx";
import ToolContext from "../../context/ToolContext.ts";
import HighlightColors from "../../enums/HighlightColors.ts";
import { iriFromSvgNode } from "../../utils/HelperFunctions.ts";
import ActionContext from "../../context/ActionContext.ts";

interface CenterLineComponentProps {
  centerLines: CenterLineProps[];
  id?: string;
  isInformationFlow: boolean;
}

export default function CenterLine(props: CenterLineComponentProps) {
  const height = useContext(PandidContext).height;
  const context = useCommissioningPackageContext();
  const setAction = useContext(ActionContext).setAction;
  const tool = useContext(ToolContext).activeTool;
  let color: HighlightColors | undefined;
  let iri: string;
  let hasSelectedInternalNode: boolean;
  if (props.id) {
    iri = iriFromSvgNode(props.id);
    const commissioningPackage = context.commissioningPackages.find(
      (pkg) =>
        pkg.boundaryNodes?.some((node) => node.id === iri) ||
        pkg.internalNodes?.some((node) => node.id === iri),
    );
    color = commissioningPackage?.color;
    if (commissioningPackage)
      hasSelectedInternalNode =
        commissioningPackage.selectedInternalNodes.length > 0;
  }

  return (
    <>
      {props.centerLines.map((centerline: CenterLineProps, index: number) =>
        centerline !== undefined ? (
          <React.Fragment key={index}>
            {(
              <path
                onClick={() =>
                    iri ? selectHandleFunction(iri, context, setAction, tool) : {}
                }
                id={iri ? iri : props.id}
                key={index + "_highlight"}
                d={constructPath(centerline.Coordinate, height)}
                stroke={color ? color : "black"}
                strokeWidth={5}
                opacity={hasSelectedInternalNode ? 0.5 : 0}
                fill={"none"}
              />
            )}
            <StyledPath

              key={index}
              d={constructPath(centerline.Coordinate, height)}
              $isDashed={props.isInformationFlow}
            />
          </React.Fragment>
        ) : (
          ""
        ),
      )}
    </>
  );
}

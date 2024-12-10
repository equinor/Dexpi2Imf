import { CenterLineProps } from "../../types/diagram/Common.ts";
import constructPath from "../../utils/Path.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import StyledPath from "./StyledPath.tsx";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import React from "react";
import selectHandleFunction from "../../utils/HandlerFunctionHelper.tsx";
import ToolContext from "../../context/ToolContext.tsx";
import { iriFromSvgNode } from "../../utils/Triplestore.ts";
import HighlightColors from "../../types/HighlightColors.ts";

interface CenterLineComponentProps {
  centerLines: CenterLineProps[];
  id?: string;
  isInformationFlow: boolean;
}

export default function CenterLine(props: CenterLineComponentProps) {
  const height = useContext(PandidContext).height;
  const context = useCommissioningPackageContext();
  const tool = useContext(ToolContext).activeTool;
  let color: HighlightColors | undefined;
  let iri: string;
  if (props.id) {
    iri = iriFromSvgNode(props.id);
    const commissioningPackage = context.commissioningPackages.find((pkg) =>
      pkg.nodeIds.find((node) => node === iri),
    );
    color = commissioningPackage?.color;
  }

  return (
    <>
      {props.centerLines.map((centerline: CenterLineProps, index: number) =>
        centerline !== undefined ? (
          <React.Fragment key={index}>
            {color && (
              <path
                id={iri ? iri : props.id}
                key={index + "_highlight"}
                d={constructPath(centerline.Coordinate, height)}
                stroke={color}
                strokeWidth={5}
                fill={"none"}
              />
            )}
            <StyledPath
              onClick={() =>
                props.id ? selectHandleFunction(props.id, context, tool) : {}
              }
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

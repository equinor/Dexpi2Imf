import { EquipmentProps, NozzleProps } from "../../types/diagram/Diagram.ts";
import { useContext } from "react";
import StyledSvgElement from "./StyledSvgElement.tsx";
import PandidContext from "../../context/PandidContext.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";
import SvgElement from "./SvgElement.tsx";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";
import {
  iriFromSvgNode,
  isBoundary,
  isInternal,
} from "../../utils/HelperFunctions.ts";
import ToolContext from "../../context/ToolContext.ts";
import selectHandleFunction from "../../utils/HandlerFunctionHelper.tsx";

export default function Equipment(props: EquipmentProps) {
  const context = useCommissioningPackageContext();
  const height = useContext(PandidContext).height;
  const tool = useContext(ToolContext).activeTool;
  const svg = useSerializeNodeSvg(
    props.ComponentName,
    props.GenericAttributes[0],
  );
  const nozzles: NozzleProps[] = props.Nozzle;

  const iri = iriFromSvgNode(props.ID);
  const commissioningPackage = context.commissioningPackages.find(
    (pkg) => pkg.nodeIds.includes(iri) || pkg.boundaryIds.includes(iri),
  );
  const isInActivePackage = commissioningPackage
    ? context.activePackage.id === commissioningPackage.id
    : true;
  const color = commissioningPackage?.color;

  return (
    <>
      <g
        onClick={() =>
          isInActivePackage ? selectHandleFunction(props.ID, context, tool) : {}
        }
      >
        {svg && (
          <>
            {color && (
              <StyledSvgElement
                id={iri + "_highlight"}
                position={props.Position}
                svg={svg}
                color={color}
              />
            )}

            <g
              id={iri}
              transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
              className={`.node ${isBoundary(props.ID, context) ? "boundary" : ""} ${isInternal(props.ID, context) ? "internal" : ""}`}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </>
        )}
        {nozzles &&
          nozzles.map((nozzle: NozzleProps, index: number) => (
            <SvgElement
              key={index}
              id={nozzle.ID}
              componentName={nozzle.ComponentName || "ND0002_SHAPE"}
              position={nozzle.Position}
              text={nozzle.GenericAttributes}
            />
          ))}
      </g>
    </>
  );
}

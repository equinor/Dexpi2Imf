import { EquipmentProps, NozzleProps } from "../../types/diagram/Diagram.ts";
import { useContext } from "react";
import StyledSvgElement from "./StyledSvgElement.tsx";
import PandidContext from "../../context/PandidContext.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";
import SvgElement from "./SvgElement.tsx";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import {
  constructClasses,
  findPackageOfNode,
  iriFromSvgNode,
  isInActivePackage,
} from "../../utils/HelperFunctions.ts";
import ToolContext from "../../context/ToolContext.ts";
import selectHandleFunction from "../../utils/CommissioningPackageActions.tsx";
import ActionContext from "../../context/ActionContext.ts";

export default function Equipment(props: EquipmentProps) {
  const { context, dispatch } = useCommissioningPackages();
  const setAction = useContext(ActionContext).setAction;
  const height = useContext(PandidContext).height;
  const tool = useContext(ToolContext).activeTool;
  const svg = useSerializeNodeSvg({
    id: props.ID,
    componentName: props.ComponentName,
    genericAttributes: props.GenericAttributes[0],
  });
  const nozzles: NozzleProps[] = props.Nozzle;

  const iri = iriFromSvgNode(props.ID);
  const commissioningPackage = findPackageOfNode(
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
      <g
        onClick={() =>
          inActivePackage
            ? selectHandleFunction(iri, context, dispatch, setAction, tool)
            : {}
        }
      >
        {svg && (
          <>
            {
              <StyledSvgElement
                id={iri}
                position={props.Position}
                svg={svg}
                color={color ? color : "black"}
              />
            }
            <g
              id={iri}
              transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
              className={constructClasses(iri, context.activePackage)}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </>
        )}
        {nozzles &&
          nozzles.map((nozzle: NozzleProps, index: number) => (
            <SvgElement
              key={index}
              id={nozzle.ID}
              label={nozzle.Label}
              componentName={nozzle.ComponentName || "ND0002_SHAPE"}
              position={nozzle.Position}
              text={nozzle.GenericAttributes}
            />
          ))}
      </g>
    </>
  );
}

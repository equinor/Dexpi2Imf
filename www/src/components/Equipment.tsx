import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import {
  ClickableComponentProps,
  isBoundary,
  isInternal,
  isInPackage,
} from "../types/ClickableComponentProps.ts";
import StyledSvgElement from "./StyledSvgElement.tsx";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import SvgElement from "./SvgElement.tsx";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";

interface EquipmentClickableProps
  extends EquipmentProps,
    ClickableComponentProps {}

export default function Equipment(props: EquipmentClickableProps) {
  const context = useCommissioningPackageContext();
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    props.ComponentName,
    props.GenericAttributes[0],
  );
  const nozzles: NozzleProps[] = props.Nozzle;
  const commissioningPackage = context.commissioningPackages.find((pkg) =>
    pkg.nodeIds.find((node) => node === props.ID),
  );
  const color = commissioningPackage?.color;
  console.log(props.onClick);
  console.log(context.activePackage.nodeIds);
  console.log(isInPackage(props.ID, context));
  return (
    <g onClick={props.onClick}>
      {svg && (
        <>
          {color && isInPackage(props.ID, context) && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color={color}
            />
          )}

          <g
            id={props.ID}
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
  );
}

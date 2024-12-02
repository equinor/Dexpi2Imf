import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import { ClickableComponentProps, handleClick, getHighlightColor } from "../types/ClickableComponentProps.ts";
import StyledSvgElement from "./StyledSvgElement.tsx";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import SvgElement from "./SvgElement.tsx";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";



interface EquipmentClickableProps {
  equipment: EquipmentProps;
  clickableComponent: ClickableComponentProps
}

export default function Equipment({
  equipment,
  clickableComponent
}: EquipmentClickableProps) {
  const packageContext = useCommissioningPackageContext()
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    equipment.ComponentName,
    equipment.GenericAttributes[0],
  );
  const color = getHighlightColor(equipment.ID, packageContext);

  const nozzles: NozzleProps[] = equipment.Nozzle;

  return (
    <g
      onClick={handleClick(clickableComponent, packageContext, equipment.ID)}
    >
      {svg && color && (
        <>
          <StyledSvgElement
            id={equipment.ID + "_highlight"}
            position={equipment.Position}
            svg={svg}
            color={color}
          />
          <g
            id={equipment.ID}
            transform={`${equipment.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${equipment.Position.Location.X}, ${height - equipment.Position.Location.Y})`}
            className={".node"}
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

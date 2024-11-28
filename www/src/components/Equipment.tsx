import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import { ClickableComponentProps, handleClick, getHighlightColors } from "../types/ClickableComponentProps.ts";
import StyledSvgElement from "./StyledSvgElement.tsx";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import SvgElement from "./SvgElement.tsx";
import { useCommissioningPackageContext } from "../hooks/useCommissioningPackageContext.tsx";



interface EquipmentClickableProps {
  props: EquipmentProps;
  clickableComponent: ClickableComponentProps
}

export default function Equipment({
  props,
  clickableComponent
}: EquipmentClickableProps) {
  const packageContext = useCommissioningPackageContext()
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    props.ComponentName,
    props.GenericAttributes[0],
  );
  const colors = getHighlightColors(props.ID, packageContext);

  const nozzles: NozzleProps[] = props.Nozzle;

  return (
    <g
      onClick={handleClick(clickableComponent, packageContext, props.ID)}
    >
      {svg && (
        <>
          {colors.length > 0 &&
            colors.map((c) => (
              <StyledSvgElement
                key={c}
                id={props.ID + "_highlight"}
                position={props.Position}
                svg={svg}
                color={c}
              />
            ))
          }
          <g
            id={props.ID}
            transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
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

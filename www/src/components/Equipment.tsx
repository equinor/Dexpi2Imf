import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import {ClickableComponentProps, handleClick} from "../types/ClickableComponentProps.ts";
import StyledSvgElement from "./StyledSvgElement.tsx";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import SvgElement from "./SvgElement.tsx";


interface EquipmentClickableProps {
  props: EquipmentProps;
  clickableComponent: ClickableComponentProps
}

export default function Equipment({
  props,
  clickableComponent
}: EquipmentClickableProps) {
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    props.ComponentName,
    props.GenericAttributes[0],
  );

  const nozzles: NozzleProps[] = props.Nozzle;

  return (
    <g
      onClick={handleClick(clickableComponent, props.ID)}
    >
      {svg && (
        <>
          {clickableComponent.isBoundary && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color="red"
            />
          )}
          {clickableComponent.isInPackage && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color="red"
            />
          )}
          {clickableComponent.isInternal && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color="yellow"
            />
          )}
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

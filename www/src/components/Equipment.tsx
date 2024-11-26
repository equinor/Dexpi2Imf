import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import {ClickableComponentProps} from "../types/ClickableComponentProps.ts";
import { StyledBoundary, StyledInternal } from "../utils/Highlighting.ts";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import { BoundaryActions } from "../utils/Triplestore.ts";
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
    onClick={(event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        if(clickableComponent.isInternal) {
          clickableComponent.onShiftClick(props.ID, BoundaryActions.Delete);
        } 
        else {
          clickableComponent.onShiftClick(props.ID, BoundaryActions.Insert);
        }
      } 
      else {
        if(clickableComponent.isBoundary) {
          clickableComponent.onClick(props.ID, BoundaryActions.Delete);
        }
        else {
          clickableComponent.onClick(props.ID, BoundaryActions.Insert);
        }
      }
    }}
    >
      {svg && (
        <>
          {clickableComponent.isBoundary && (
            <StyledBoundary
              id={props.ID + "_highlight"}
              transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
              className={".node"}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
          {clickableComponent.isInternal && (
            <StyledInternal
              id={props.ID + "_highlight"}
              transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
              className={".node"}
              dangerouslySetInnerHTML={{ __html: svg }}
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

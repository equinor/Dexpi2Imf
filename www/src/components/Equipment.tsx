import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import {ClickableComponentProps} from "../types/ClickableComponentProps.ts";
import { StyledBoundary, StyledInternal } from "../utils/Highlighting.ts";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import { BoundaryActions } from "../utils/Triplestore.ts";
import SvgElement from "./SvgElement.tsx";


interface EquipmentComponentProps {
  equipment: EquipmentProps;
  clickableComponent: ClickableComponentProps
}

export default function Equipment({
  equipment,
  clickableComponent
}: EquipmentComponentProps) {
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    equipment.ComponentName,
    equipment.GenericAttributes[0],
  );

  const nozzles: NozzleProps[] = equipment.Nozzle;

  return (
    <g
    onClick={(event) => {
      if (event.ctrlKey) {
        event.preventDefault();
        if(clickableComponent.isInternal) {
          clickableComponent.onShiftClick(equipment.ID, BoundaryActions.Delete);
        } 
        else {
          clickableComponent.onShiftClick(equipment.ID, BoundaryActions.Insert);
        }
      } 
      else {
        if(clickableComponent.isBoundary) {
          clickableComponent.onClick(equipment.ID, BoundaryActions.Delete);
        }
        else {
          clickableComponent.onClick(equipment.ID, BoundaryActions.Insert);
        }
      }
    }}
    >
      {svg && (
        <>
          {clickableComponent.isBoundary && (
            <StyledBoundary
              id={equipment.ID + "_highlight"}
              transform={`${equipment.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${equipment.Position.Location.X}, ${height - equipment.Position.Location.Y})`}
              className={".node"}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
          {clickableComponent.isInternal && (
            <StyledInternal
              id={equipment.ID + "_highlight"}
              transform={`${equipment.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${equipment.Position.Location.X}, ${height - equipment.Position.Location.Y})`}
              className={".node"}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
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

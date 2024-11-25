import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import styled from "styled-components";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import { BoundaryActions } from "../utils/Triplestore.ts";
import SvgElement from "./SvgElement.tsx";

const StyledInternal = styled.g`
  path {
    stroke: yellow;
    stroke-width: 5;
    opacity: 0.5 ;
  }
`;

const StyledBoundary = styled.g`
path {
  stroke: red;
  stroke-width: 5;
  opacity: 0.5 ;
}
`;

interface EquipmentComponentProps {
  equipment: EquipmentProps;
  onClick: (
    id: string,
    action: BoundaryActions,
  ) => Promise<void>;
  onShiftClick: (
    id: string, 
    action: BoundaryActions
  ) => Promise<void>;
  isBoundary: boolean;
  isInternal: boolean;
}

export default function Equipment({
  equipment,
  onClick,
  onShiftClick,
  isBoundary,
  isInternal,
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
        if(isInternal) {
          onShiftClick(equipment.ID, BoundaryActions.Delete);
        } 
        else {
          onShiftClick(equipment.ID, BoundaryActions.Insert);
        }
      } 
      else {
        if(isBoundary) {
          onClick(equipment.ID, BoundaryActions.Delete);
        }
        else {
          onClick(equipment.ID, BoundaryActions.Insert);
        }
      }
    }}
    >
      {svg && (
        <>
          {isBoundary && (
            <StyledBoundary
              id={equipment.ID + "_highlight"}
              transform={`${equipment.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${equipment.Position.Location.X}, ${height - equipment.Position.Location.Y})`}
              className={".node"}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
          {isInternal && (
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

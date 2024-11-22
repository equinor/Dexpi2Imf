import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import { useContext } from "react";
import styled from "styled-components";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";
import { BoundaryActions, BoundaryParts } from "../utils/Triplestore.ts";
import SvgElement from "./SvgElement.tsx";

const StyledG = styled.g`
  path {
    stroke: yellow;
    stroke-width: 5;
  }
`;

interface EquipmentComponentProps {
  equipment: EquipmentProps;
  onClick: (
    id: string,
    action: BoundaryActions,
    type: BoundaryParts,
  ) => Promise<void>;
  isInBoundary: boolean;
}

export default function Equipment({
  equipment,
  onClick,
  isInBoundary,
}: EquipmentComponentProps) {
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    equipment.ComponentName,
    equipment.GenericAttributes[0],
  );

  const nozzles: NozzleProps[] = equipment.Nozzle;

  return (
    <g
      onClick={() =>
        onClick(equipment.ID, BoundaryActions.Insert, BoundaryParts.Boundary)
      }
    >
      {svg && (
        <>
          {isInBoundary && (
            <StyledG
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
            height={height}
            position={nozzle.Position}
            text={nozzle.GenericAttributes}
          />
        ))}
    </g>
  );
}

import { EquipmentProps, NozzleProps } from "../types/diagram/Diagram.ts";
import Nozzle from "./Nozzle.tsx";
import { useContext, useState } from "react";
import styled from "styled-components";
import PandidContext from "../context/PandidContext.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";

const StyledG = styled.g`
  path {
    stroke: yellow;
    stroke-width: 5;
  }
`;

export default function Equipment(props: EquipmentProps) {
  const height = useContext(PandidContext).height;
  const svg = useSerializeNodeSvg(
    props.ComponentName,
    props.Position,
    props.GenericAttributes[0],
  );

  const nozzles: NozzleProps[] = props.Nozzle;
  const [isClicked, setIsClicked] = useState<boolean>(false);
  function handleNodeClick() {
    setIsClicked(!isClicked);
  }

  return (
    <g onClick={handleNodeClick}>
      {svg && (
        <>
          {isClicked && (
            <StyledG
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
      {nozzles.map((nozzle: NozzleProps, index: number) => (
        <Nozzle key={index} {...nozzle} />
      ))}
    </g>
  );
}

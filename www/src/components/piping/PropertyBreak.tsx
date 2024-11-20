import { PropertyBreakProps } from "../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import useSerializeSvgWithoutEdits from "../../hooks/useSerializeSvgWithoutEdits.tsx";
import constructPath from "../../utils/Path.ts";
import styled from "styled-components";

const StyledPath = styled.path`
  stroke: #000000;
  stroke-width: 0.25;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export default function PropertyBreak(props: PropertyBreakProps) {
  const height = useContext(PandidContext).height;
  const svg = useSerializeSvgWithoutEdits(props.ComponentName);
  return (
    <>
      {svg && (
        <g
          id={props.ID}
          transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
      {props.PolyLine && (
        <StyledPath d={constructPath(props.PolyLine.Coordinate, height)} />
      )}
    </>
  );
}

import { LabelProps } from "../../types/diagram/Piping.ts";
import calculateAngleAndRotation from "../../utils/Transformation.ts";
import constructPath from "../../utils/Path.ts";
import styled from "styled-components";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import useSerializeSvgWithoutEdits from "../../hooks/useSerializeSvgWithoutEdits.tsx";

const StyledPath = styled.path`
  stroke: #000000;
  stroke-width: 0.25;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

export default function PipeLabel(props: LabelProps) {
  const context = useContext(PandidContext);
  const height = context.height;
  const svg = useSerializeSvgWithoutEdits(props.ComponentName);

  return (
    <>
      {svg && (
        <g
          id={props.ID}
          transform={calculateAngleAndRotation(
            props.Position.Reference.X,
            props.Position.Reference.Y,
            props.Position.Location.X,
            height - props.Position.Location.Y,
          )}
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

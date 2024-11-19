import styled from "styled-components";
import { CenterLineProps } from "../types/diagram/Common.ts";
import constructPath from "../utils/Path.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";

interface CenterLineComponentProps {
  centerLines: CenterLineProps[];
  isInformationFlow: boolean;
}

interface StyledPathProps {
  $isDashed: boolean;
}
const StyledPath = styled.path<StyledPathProps>`
  stroke: #000000;
  stroke-width: 0.25;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: ${({ $isDashed }) => ($isDashed ? "1,4" : "")};
`;

export default function CenterLine(props: CenterLineComponentProps) {
  const height = useContext(PandidContext).height;
  return (
    <>
      {props.centerLines.map((centerline: CenterLineProps, index: number) =>
        centerline !== undefined ? (
          <StyledPath
            key={index}
            d={constructPath(centerline.Coordinate, height)}
            $isDashed={props.isInformationFlow}
          />
        ) : (
          ""
        ),
      )}
    </>
  );
}

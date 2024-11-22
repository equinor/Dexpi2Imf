import { CenterLineProps } from "../types/diagram/Common.ts";
import constructPath from "../utils/Path.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import StyledPath from "./StyledPath.tsx";

interface CenterLineComponentProps {
  centerLines: CenterLineProps[];
  isInformationFlow: boolean;
}

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

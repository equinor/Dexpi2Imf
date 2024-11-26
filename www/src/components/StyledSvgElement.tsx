import {
    PositionProps,
} from "../types/diagram/Common.ts";
import calculateAngleAndRotation from "../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import styled from "styled-components"

interface StyledSvgElementProps {
    id: string;
    position?: PositionProps;
    svg: string;
    color: string;
}

export default function StyledSvgElement({
    id,
    position,
    svg, 
    color
}: StyledSvgElementProps) {
    const height = useContext(PandidContext).height;
    const StyledG = styled.g`
    path {
      stroke: ${color};
      stroke-width: 5;
      opacity: 0.5 ;
    }
  `
    return (
        <>
            {svg && (
                <StyledG
                    id={id}
                    transform={
                        position
                            ? calculateAngleAndRotation(
                                position.Reference.X,
                                position.Reference.Y,
                                position.Location.X,
                                height - position.Location.Y,
                            )
                            : ""
                    }
                    className={".node"}
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            )}
        </>
    );
}

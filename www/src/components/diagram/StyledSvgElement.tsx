import { PositionProps } from "../../types/diagram/Common.ts";
import calculateAngleAndRotation from "../../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import styled from "styled-components";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";

interface StyledSvgElementProps {
  id: string;
  position?: PositionProps;
  svg: string;
  color: string;
}

const StyledG = styled.g`
  path {
    stroke: ${(props) => props.color};
    stroke-width: 5;
    opacity: 1;
  }
`;

export default function StyledSvgElement({
  id,
  position,
  svg,
  color,
}: StyledSvgElementProps) {
  const height = useContext(PandidContext).height;
  const context = useCommissioningPackageContext();
  const hasBoundaryNode = context.activePackage.boundaryIds.length > 0;
  const hasSelectedInternalNode = context.activePackage.selectedInternalIds.length > 0;

  if (!hasBoundaryNode || !hasSelectedInternalNode) {
    return null;
  }

  return (
    <>
      {svg && (
        <StyledG
          id={id}
          color={color}
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

import { PositionProps } from "../../types/diagram/Common.ts";
import calculateAngleAndRotation from "../../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import styled from "styled-components";
import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";

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
  const { context } = useCommissioningPackages();
  const commissioningPackage = context.commissioningPackages.find(
    (pkg) =>
      pkg.boundaryNodes?.some((node) => node.id === id) ||
      pkg.internalNodes?.some((node) => node.id === id),
  );
  let hasSelectedInternalNode: boolean;
  if (commissioningPackage) {
    hasSelectedInternalNode =
      commissioningPackage.selectedInternalNodes.length > 0;

    return (
      <>
        {svg && hasSelectedInternalNode && (
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

  return null;
}

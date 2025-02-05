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
  const commissioningPackage = context.commissioningPackages.find(
    (pkg) =>
      pkg.boundaryNodes?.some((node) => node.id === id) ||
      pkg.internalNodes?.some((node) => node.id === id),
  );
  let hasSelectedInternalNode: boolean;
  console.log("HELLO")
  if (commissioningPackage) {
    hasSelectedInternalNode =
      commissioningPackage.selectedInternalNodes.length > 0;

    return (
      <>
        {svg && (
          <StyledG
            id={id}
            color={hasSelectedInternalNode ? color : "black"}
            opacity={1}
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

import { PipingComponentProps } from "../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import constructPath from "../../utils/Path.ts";
import StyledPath from "../StyledPath.tsx";
import { ClickableComponentProps, getHighlightColor, handleClick } from "../../types/ClickableComponentProps.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";
import StyledSvgElement from "../StyledSvgElement.tsx";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";

interface PipingComponentClickableProps {
  pipingComponent: PipingComponentProps;
  clickableComponent: ClickableComponentProps;
}

export default function PipingComponent({
  pipingComponent,
  clickableComponent
}: PipingComponentClickableProps) {
  const context = useContext(PandidContext);
  const packageContext = useCommissioningPackageContext()
  const color = getHighlightColor(pipingComponent.ID, packageContext)
  const height = context.height;
  const componentName = pipingComponent.ComponentName;
  const label = pipingComponent.Label;
  const svg = pipingComponent.ComponentName != null ? useSerializeNodeSvg(
    pipingComponent.ComponentName,
    pipingComponent.GenericAttributes,
  ) : null;

  return (
    <g
      onClick={handleClick(clickableComponent, packageContext, pipingComponent.ID)}
    >
      {componentName && svg && (
        <>
          {color && 
            <StyledSvgElement
              id={pipingComponent.ID + "_highlight"}
              position={pipingComponent.Position}
              svg={svg}
              color={color}
            />
          }

          <SvgElement
            id={pipingComponent.ID}
            componentName={componentName}
            position={pipingComponent.Position}
            text={pipingComponent.GenericAttributes}
          />
        </>
      )}
      {label && (
        <>
          {label.PolyLine && (
            <StyledPath
              d={constructPath(label.PolyLine.Coordinate, height)}
              $isDashed={false}
            />
          )}
        </>
      )}
    </g>
  );
}

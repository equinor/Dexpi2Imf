import { PipingComponentProps } from "../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import constructPath from "../../utils/Path.ts";
import StyledPath from "../StyledPath.tsx";
import { ClickableComponentProps, handleClick } from "../../types/ClickableComponentProps.ts";
import useSerializeNodeSvg from "../../hooks/useSerializeNodeSvg.tsx";
import StyledSvgElement from "../StyledSvgElement.tsx";
import { useCommissioningPackageContext } from "../../hooks/useCommissioningPackageContext.tsx";

interface PipingComponentClickableProps {
  props: PipingComponentProps;
  clickableComponent: ClickableComponentProps;
}

export default function PipingComponent({
  props,
  clickableComponent
}: PipingComponentClickableProps) {
  const context = useContext(PandidContext);
  const context2 = useCommissioningPackageContext();
  const height = context.height;
  const componentName = props.ComponentName;
  const label = props.Label;
  const svg = props.ComponentName != null ? useSerializeNodeSvg(
    props.ComponentName,
    props.GenericAttributes,
  ) : null;

  return (
    <g
      onClick={handleClick(clickableComponent, props.ID)}
    >
      {componentName && svg && (
        <>
          {clickableComponent.isBoundary && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color="red"
            />
          )}
          {clickableComponent.isInPackage && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color="yellow"
            />
          )}
          {clickableComponent.isInternal && (
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color="green"
            />
          )}
          <SvgElement
            id={props.ID}
            componentName={componentName}
            position={props.Position}
            text={props.GenericAttributes}
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

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
  props: PipingComponentProps;
  clickableComponent: ClickableComponentProps;
}

export default function PipingComponent({
  props,
  clickableComponent
}: PipingComponentClickableProps) {
  const context = useContext(PandidContext);
  const packageContext = useCommissioningPackageContext()
  const color = getHighlightColor(props.ID, packageContext)
  const height = context.height;
  const componentName = props.ComponentName;
  const label = props.Label;
  const svg = props.ComponentName != null ? useSerializeNodeSvg(
    props.ComponentName,
    props.GenericAttributes,
  ) : null;

  return (
    <g
      onClick={handleClick(clickableComponent, packageContext, props.ID)}
    >
      {componentName && svg && (
        <>
          {color && 
            <StyledSvgElement
              id={props.ID + "_highlight"}
              position={props.Position}
              svg={svg}
              color={color}
            />
          }

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

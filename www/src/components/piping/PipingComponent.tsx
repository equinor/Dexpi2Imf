import { PipingComponentProps } from "../../types/diagram/Piping.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import SvgElement from "../SvgElement.tsx";
import constructPath from "../../utils/Path.ts";
import StyledPath from "../StyledPath.tsx";
import { ClickableComponentProps } from "../../types/ClickableComponentProps.ts";

interface PipingComponentClickableProps {
  props : PipingComponentProps;
  clickableComponent: ClickableComponentProps;
}

export default function PipingComponent({
  props, 
  clickableComponent
} : PipingComponentClickableProps) {
  const context = useContext(PandidContext);
  const height = context.height;
  const componentName = props.ComponentName; // string | undefined
  const label = props.Label;
  return (
    <>
      {componentName && (
        <SvgElement
          id={props.ID}
          componentName={componentName}
          position={props.Position}
          text={props.GenericAttributes}
        />
      )}
      {label && (
        <>
          <SvgElement
            id={label.ID}
            componentName={label.ComponentName}
            position={label.Position}
          />
          {label.PolyLine && (
            <StyledPath
              d={constructPath(label.PolyLine.Coordinate, height)}
              $isDashed={false}
            />
          )}
        </>
      )}
    </>
  );
}

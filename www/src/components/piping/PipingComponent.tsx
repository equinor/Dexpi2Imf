import { PipingComponentProps } from "../../types/diagram/Piping.ts";
import calculateAngleAndRotation from "../../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../../context/PandidContext.ts";
import PipeLabel from "./PipeLabel.tsx";
import useSerializeSvgWithoutEdits from "../../hooks/useSerializeSvgWithoutEdits.tsx";

interface PipingComponentSVGProps {
  id: string;
  componentName: string;
  transform: string;
}

function PipingComponentSVG({
  id,
  componentName,
  transform,
}: PipingComponentSVGProps) {
  const svg = useSerializeSvgWithoutEdits(componentName);

  return (
    <>
      {svg && (
        <g
          id={id}
          transform={transform}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </>
  );
}

export default function PipingComponent(props: PipingComponentProps) {
  const context = useContext(PandidContext);
  const height = context.height;
  const componentName = props.ComponentName; // string | undefined
  const label = props.Label;
  const hasPosition: boolean = Boolean(props.Position);
  return (
    <>
      {componentName && (
        <PipingComponentSVG
          id={props.ID}
          componentName={componentName}
          transform={
            hasPosition
              ? calculateAngleAndRotation(
                  props.Position.Reference.X,
                  props.Position.Reference.Y,
                  props.Position.Location.X,
                  height - props.Position.Location.Y,
                )
              : ""
          }
        />
      )}
      {label && <PipeLabel {...label} />}
    </>
  );
}

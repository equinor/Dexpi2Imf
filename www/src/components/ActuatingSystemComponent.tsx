import { ActuatingSystemComponentProps } from "../types/diagram/ActuatingSystem.ts";
import calculateAngleAndRotation from "../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import useSerializeSvgWithoutEdits from "../hooks/useSerializeSvgWithoutEdits.tsx";

export default function ActuatingSystemComponent(
  props: ActuatingSystemComponentProps,
) {
  const height = useContext(PandidContext).height;
  const hasPosition = Boolean(props.Position);
  const svg = useSerializeSvgWithoutEdits(props.ComponentName!);

  return (
    <>
      {svg && (
        <g
          id={props.ID}
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
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </>
  );
}

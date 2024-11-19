import { NozzleProps } from "../types/diagram/Diagram.ts";
import useNoakaDexpiSvg from "../hooks/useNoakaDexpiSvg.ts";
import calculateAngleAndRotation from "../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";

export default function Nozzle(props: NozzleProps) {
  const height = useContext(PandidContext).height;
  let componentName = "ND0002_Origo";
  if (props.ComponentName) {
    componentName = props.ComponentName;
  }
  const hasPosition: boolean = Boolean(props.Position);
  const svg = useNoakaDexpiSvg(componentName);

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

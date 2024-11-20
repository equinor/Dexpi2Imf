import { NozzleProps } from "../types/diagram/Diagram.ts";
import calculateAngleAndRotation from "../utils/Transformation.ts";
import { useContext } from "react";
import PandidContext from "../context/PandidContext.ts";
import NozzleLabel from "./NozzleLabel.tsx";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";

export default function Nozzle(props: NozzleProps) {
  const height = useContext(PandidContext).height;
  let componentName = "ND0002_Origo";
  if (props.ComponentName) {
    componentName = props.ComponentName;
  }
  const hasPosition: boolean = Boolean(props.Position);
  const svg = useSerializeNodeSvg(componentName);

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
      {props.Label ? (
        <NozzleLabel
          label={props.Label}
          genericAttributes={props.GenericAttributes}
        />
      ) : (
        <></>
      )}
    </>
  );
}

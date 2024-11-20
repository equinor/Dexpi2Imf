import { PipeSlopeSymbolProps } from "../../types/diagram/Piping.ts";
import useSerializeSvgWithoutEdits from "../../hooks/useSerializeSvgWithoutEdits.tsx";
import PandidContext from "../../context/PandidContext.ts";
import { useContext } from "react";

export default function PipeSlopeComponent(props: PipeSlopeSymbolProps) {
  const height = useContext(PandidContext).height;
  const svg = useSerializeSvgWithoutEdits(props.ComponentName);
  return (
    <>
      {svg && (
        <g
          id={props.ID}
          transform={`${props.Position.Reference.X === -1 ? "rotate(-180deg)" : ""}translate(${props.Position.Location.X}, ${height - props.Position.Location.Y})`}
          className={".node"}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </>
  );
}

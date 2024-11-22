import {
  GenericAttributesProps,
  PositionProps,
} from "../types/diagram/Common.ts";
import calculateAngleAndRotation from "../utils/Transformation.ts";
import useSerializeNodeSvg from "../hooks/useSerializeNodeSvg.tsx";

interface SvgElementProps {
  id: string;
  componentName: string;
  height: number;
  position?: PositionProps;
  text?: GenericAttributesProps;
}

export default function SvgElement({
  id,
  componentName,
  height,
  position,
  text,
}: SvgElementProps) {
  const svg = useSerializeNodeSvg(componentName, text);
  return (
    <>
      {svg && (
        <g
          id={id}
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

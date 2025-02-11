import { useContext, useEffect, useState } from "react";
import { addTextToPipe, serializeElement } from "../utils/SvgEdit.ts";
import {
  GenericAttributesProps,
  PositionProps,
} from "../types/diagram/Common.ts";
import PandidContext from "../context/PandidContext.ts";

//TODO - remove when new graphical format implemented
export default function useSerializePipeSvg(
  componentName: string,
  genericAttributes: GenericAttributesProps,
  height: number,
  position: PositionProps,
) {
  const [serializedSvg, setSerializedSvg] = useState<string>("");
  const svg = useContext(PandidContext).svgMap.get(componentName);
  useEffect(() => {
    if (!svg) return;
    addTextToPipe(svg, genericAttributes, height, position);
    setSerializedSvg(serializeElement(svg));
  }, [svg]);
  return serializedSvg;
}

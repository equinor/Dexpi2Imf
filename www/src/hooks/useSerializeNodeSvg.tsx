import { useContext, useEffect, useState } from "react";
import {
  addTextToNode,
  removeConnectionPointsAndOrigo,
  removeRedPath,
  serializeElement,
} from "../utils/SvgEdit.ts";
import { GenericAttributesProps } from "../types/diagram/Common.ts";
import PandidContext from "../context/PandidContext.ts";

export default function useSerializeNodeSvg(
  componentName: string,
  genericAttributes: GenericAttributesProps | undefined,
) {
  const [serializedSvg, setSerializedSvg] = useState<string>("");
  const svg = useContext(PandidContext).svgMap.get(componentName);
  useEffect(() => {
    if (!svg) return;
    if (genericAttributes) {
      addTextToNode(svg, genericAttributes);
    }
    removeConnectionPointsAndOrigo(svg);
    removeRedPath(svg);
    setSerializedSvg(serializeElement(svg));
  }, [svg]);
  return serializedSvg;
}

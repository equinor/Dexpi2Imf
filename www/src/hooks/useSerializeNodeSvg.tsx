import { useEffect, useState } from "react";
import useNoakaDexpiSvg from "./useNoakaDexpiSvg.ts";
import {
  addTextToNode,
  removeConnectionPointsAndOrigo,
  removeRedPath,
  serializeElement,
} from "../utils/SvgEdit.ts";
import {
  GenericAttributesProps,
  PositionProps,
} from "../types/diagram/Common.ts";

export default function useSerializeNodeSvg(
  componentName: string,
  position?: PositionProps,
  genericAttributes?: GenericAttributesProps,
) {
  const [serializedSvg, setSerializedSvg] = useState<string>("");
  const svg = useNoakaDexpiSvg(componentName);
  useEffect(() => {
    if (!svg) return;
    if (genericAttributes && position) {
      addTextToNode(svg, genericAttributes, position);
    }
    removeConnectionPointsAndOrigo(svg);
    removeRedPath(svg);
    setSerializedSvg(serializeElement(svg));
  }, [svg]);
  return serializedSvg;
}

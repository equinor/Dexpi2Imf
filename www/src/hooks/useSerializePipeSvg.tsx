import { useEffect, useState } from "react";
import { addTextToPipe, serializeElement } from "../utils/SvgEdit.ts";
import {
  GenericAttributesProps,
  PositionProps,
} from "../types/diagram/Common.ts";
import useNoakaDexpiSvg from "./useNoakaDexpiSvg.ts";

export default function useSerializePipeSvg(
  componentName: string,
  genericAttributes: GenericAttributesProps,
  height: number,
  position: PositionProps,
) {
  const [serializedSvg, setSerializedSvg] = useState<string>("");
  const svg = useNoakaDexpiSvg(componentName);
  useEffect(() => {
    if (!svg) return;
    addTextToPipe(svg, genericAttributes, height, position);
    setSerializedSvg(serializeElement(svg));
  }, [svg]);
  return serializedSvg;
}

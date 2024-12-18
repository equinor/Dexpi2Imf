import { useContext, useEffect, useState } from "react";
import {
  addTextToNode,
  addTextToNozzle,
  removeConnectionPointsAndOrigo,
  removeRedPath,
  serializeElement,
} from "../utils/SvgEdit.ts";
import { GenericAttributesProps, LabelProps } from "../types/diagram/Common.ts";
import PandidContext from "../context/PandidContext.ts";

interface SerializedNodeProps {
  id: string;
  componentName: string;
  label?: LabelProps;
  genericAttributes?: GenericAttributesProps;
}

export default function useSerializeNodeSvg({
  id,
  componentName,
  label,
  genericAttributes,
}: SerializedNodeProps) {
  const [serializedSvg, setSerializedSvg] = useState<string>("");
  const svg = useContext(PandidContext).svgMap.get(componentName);
  useEffect(() => {
    // Weird quirk - Nozzle-7 lacks position information and generic attributes. Therefore, we simply do not render it.
    if (!svg || id.includes("Nozzle-7")) return;
    if (id.includes("Nozzle") && label && genericAttributes) {
      addTextToNozzle(svg, label, genericAttributes);
    } else if (genericAttributes) {
      addTextToNode(svg, genericAttributes);
    }
    removeConnectionPointsAndOrigo(svg);
    removeRedPath(svg);
    setSerializedSvg(serializeElement(svg));
  }, [svg]);
  return serializedSvg;
}

import { useEffect, useState } from "react";
import { serializeElement } from "../utils/SvgEdit.ts";
import useNoakaDexpiSvg from "./useNoakaDexpiSvg.ts";

export default function useSerializeSvgWithoutEdits(componentName: string) {
  const svg = useNoakaDexpiSvg(componentName);
  const [serializedSvg, setSerializedSvg] = useState<string>("");
  useEffect(() => {
    if (!svg) return;
    setSerializedSvg(serializeElement(svg));
  }, [svg]);
  return serializedSvg;
}

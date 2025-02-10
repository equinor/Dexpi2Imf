import {
  GenericAttributesProps,
  LabelProps,
  PositionProps,
  TextProps,
} from "../types/diagram/Common.ts";
import { calculateAngle } from "./Transformation.ts";
import { XMLProps } from "../types/diagram/Diagram.ts";
import { setAttributes } from "./HelperFunctions.ts";

//TODO - remove when new graphical format implemented
export async function noakaDexpiSvg(componentName: string) {
  const shapeName = `/Origo/${componentName.replace("_SHAPE", "_Origo")}.svg`;
  try {
    const response = await fetch(shapeName);
    if (!response.ok)
      throw new Error(`Failed to fetch SVG for ${componentName}`);
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    return svgDoc.querySelector("svg > g"); // Return the root SVG element
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const preloadSVGs = async (obj: XMLProps) => {
  const componentNames = new Set<string>();

  const traverse = (node: any) => {
    if (typeof node !== "object" || node === null) return;

    if (node.ComponentName) {
      componentNames.add(node.ComponentName);
    }

    Object.values(node).forEach(traverse);
  };

  traverse(obj);
  const svgMap = new Map<string, Element | null>();

  await Promise.all(
    Array.from(componentNames).map(async (name: string) => {
      svgMap.set(name, await noakaDexpiSvg(name));
    }),
  );
  return svgMap;
};

export function addTextToNode(
  element: Element,
  genericAttributes: GenericAttributesProps,
) {
  const labelElement = element.querySelector(`[data-LabelIndex="A"]`);
  if (labelElement) {
    const textElement = labelElement.querySelector("text");
    labelElement.querySelectorAll("path").forEach((e) => e.remove());
    setAttributes(textElement!, {
      y: `${parseInt(textElement!.getAttribute("y")!)}`,
      x: `${parseInt(textElement!.getAttribute("x")!) - 15}`,
      "font-size": "45px",
      fill: "black",
    });
    const genericAttribute = extractGenericAttributes(genericAttributes);
    textElement!.textContent = genericAttribute[0].Value;
  }

  return element;
}

export function extractGenericAttributes(data: GenericAttributesProps) {
  if (Array.isArray(data)) {
    return data
      .map((obj) => (obj && obj.GenericAttribute) || null)
      .filter((attr) => attr !== null);
  } else if (data && data.GenericAttribute) {
    return Array.isArray(data.GenericAttribute)
      ? data.GenericAttribute
      : [data.GenericAttribute];
  }
  return [];
}

export function addTextToPipe(
  element: Element,
  genericAttributes: GenericAttributesProps,
  height: number,
  position: PositionProps,
) {
  const textElement = element.querySelector(`text`);
  element.querySelectorAll("path").forEach((e) => e.remove());
  setAttributes(textElement!, {
    x: `${position.Location.X}`,
    y: `${height - position.Location.Y}`,
    transform: calculateAngle(position, height),
    "font-size": "3.3px",
    "text-anchor": "middle",
    fill: "black",
  });
  textElement!.textContent = genericAttributes.GenericAttribute[0].Value;
}

export function addTextToNozzle(
  element: Element,
  label: LabelProps,
  genericAttributes: GenericAttributesProps,
) {
  const textElement = element.querySelector(`text`);
  if (!textElement) return;

  function findTextAnchor(text: TextProps) {
    switch (text.Justification) {
      case "RightCenter":
        return "End";
      case "LeftCenter":
        return "Start";
      case "CenterCenter":
        return "Middle";
      default:
        return "Middle";
    }
  }

  setAttributes(textElement, {
    x: `5`,
    y: `5`,
    transform: label.Text.TextAngle
      ? `rotate(${label.Text.TextAngle} 0 0)`
      : `rotate(0 0 0)`,
    "font-size": `${label.Text.Height}`,
    "text-anchor": findTextAnchor(label.Text),
    "font-family": `${label.Text.Font}`,
    fill: "black",
  });

  textElement!.textContent = genericAttributes.GenericAttribute[0].Value;
  return element;
}

export function removeConnectionPoints(element: Element) {
  element.querySelectorAll(`[data-label="Connection"]`).forEach((parent) => {
    parent.querySelectorAll("*").forEach((child) => {
      child.setAttribute("stroke", "none");
    });
  });
}

export function removeOrigo(element: Element) {
  element.querySelectorAll(`[data-label="origo"]`).forEach((parent) => {
    parent.querySelectorAll("*").forEach((child) => {
      child.setAttribute("stroke", "none");
    });
  });
}

export function removeRedPath(element: Element) {
  const paths = element.querySelectorAll("path");
  if (paths) {
    const redPaths = Array.from(paths).filter((path) => {
      const stroke = path.getAttribute("stroke");
      return stroke === "red" || stroke === "#ff0000";
    });
    redPaths.forEach((e) => e.remove());
  }
}

export function removeConnectionPointsAndOrigo(element: Element) {
  removeConnectionPoints(element);
  removeOrigo(element);
}

export function serializeElement(element: Element) {
  return new XMLSerializer().serializeToString(element);
}

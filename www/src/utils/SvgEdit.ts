import { setAttributes } from "./Highlighting.ts";
import {
  GenericAttributesProps,
  LabelProps,
  PositionProps,
  TextProps,
} from "../types/diagram/Common.ts";
import { calculateAngle } from "./Transformation.ts";

export function addTextToNode(
  element: Element,
  genericAttributes: GenericAttributesProps,
) {
  const labelElement = element.querySelector(`[data-LabelIndex="A"]`);
  if (labelElement) {
    const textElement = labelElement.querySelector("text");
    labelElement.querySelectorAll("path").forEach((e) => e.remove());
    setAttributes(textElement!, {
      y: `${parseInt(textElement!.getAttribute("y")!) + 15}`,
      x: `${parseInt(textElement!.getAttribute("x")!) - 75}`,
      "font-size": "45px",
      fill: "black",
    });
    textElement!.textContent = genericAttributes.GenericAttribute[0].Value;
  }

  return element;
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
  label: LabelProps,
  genericAttributes: GenericAttributesProps,
  height: number,
) {
  const textElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );

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
    x: `${label.Text.Position.Location.X}`,
    y: `${height - label.Text.Position.Location.Y}`,
    transform: label.Text.TextAngle
      ? `rotate(${360 - Number(label.Text.TextAngle)} ${label.Text.Position.Location.X} ${height - label.Text.Position.Location.Y})`
      : `rotate(0 ${label.Text.Position.Location.X} ${height - label.Text.Position.Location.Y})`,
    "font-size": `${label.Text.Height}`,
    "text-anchor": findTextAnchor(label.Text),
    "font-family": `${label.Text.Font}`,
    fill: "black",
  });
  textElement!.textContent = genericAttributes.GenericAttribute[0].Value;
  return textElement;
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

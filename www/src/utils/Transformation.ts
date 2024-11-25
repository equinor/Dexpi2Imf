import { PositionProps } from "../types/diagram/Common.ts";

export default function calculateAngleAndRotation(
  refX: number,
  refY: number,
  posX: number,
  posY: number,
) {
  const transformations = [];
  //Pointing up
  if (refX == 0 && refY == 1) {
    transformations.push("rotate(-90 " + posX + " " + posY + ")");
  }
  // Pointing down
  if (refX == 0 && refY == -1) {
    transformations.push("rotate(90 " + posX + " " + posY + ")");
  }
  // Pointing left
  if (refX == -1 && refY == 0) {
    transformations.push("rotate(180 " + posX + " " + posY + ")");
  }
  // Apply translation
  transformations.push("translate(" + posX + " " + posY + ")");
  return transformations.join("");
}

// Calculates the angle from a given position, and returns a rotation string
export function calculateAngle(
  position: PositionProps,
  height: number,
): string {
  const axisLength = Math.sqrt(
    position.Axis.X * position.Axis.X +
      position.Axis.Y * position.Axis.Y +
      position.Axis.Z * position.Axis.Z,
  );
  if (axisLength === 0) {
    throw new Error("axisX, axisY and axisZ must not be all zero");
  }

  const rotDirection = Math.sign(position.Axis.Z);
  const refAxisLength = Math.sqrt(
    position.Reference.X * position.Reference.X +
      position.Reference.Y * position.Reference.Y +
      position.Reference.Z * position.Reference.Z,
  );
  if (refAxisLength === 0) {
    throw new Error("refX, refY and refZ must not be all zero");
  }

  const cosTheta = position.Reference.X / refAxisLength;
  const sinTheta = position.Reference.Y / refAxisLength;
  const thetaFromCos = Math.acos(cosTheta);
  const thetaFromSin = Math.asin(sinTheta);
  let theta = thetaFromCos;
  if (sinTheta < 0) {
    if (cosTheta < 0) {
      theta = -thetaFromCos;
    } else {
      theta = thetaFromSin;
    }
  }
  return `rotate(${(-rotDirection * theta * 180) / Math.PI} ${position.Location.X} ${height - position.Location.Y})`;
}

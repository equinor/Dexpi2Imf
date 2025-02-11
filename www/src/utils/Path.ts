import { CoordinateProps } from "../types/diagram/Common.ts";

//TODO - remove when new graphical format implemented
export default function constructPath(
  coordinates: CoordinateProps[],
  height: number,
) {
  let dString = "M ";
  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    dString += `${coordinate.X} ${height - coordinate.Y}`;
    if (i !== coordinates.length - 1) {
      dString += ` L `;
    }
  }
  return dString;
}

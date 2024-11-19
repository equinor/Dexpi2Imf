import { useEffect, useState } from "react";

export default function useNoakaDexpiSvg(componentName: string) {
  let shapeName = "";
  if (componentName === "PV001A_SHAPE") {
    shapeName = "/PV001A_Origo.svg";
  } else {
    shapeName = `https://raw.githubusercontent.com/equinor/NOAKADEXPI/refs/heads/main/Symbols/Origo/${componentName.replace("_SHAPE", "_Origo")}.svg`;
  }

  const [svg, setSvg] = useState<string>("");

  // Fetch SVG
  useEffect(() => {
    fetch(shapeName)
      .then((res) => res.text())
      .then((data) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");
        // We do not want the svg element itself or the xml metadata, only the child g tag
        const gElement = svgDoc.querySelector("svg > g");
        if (gElement) {
          const serializedGElement = new XMLSerializer().serializeToString(
            gElement,
          );
          setSvg(serializedGElement);
        } else {
          console.error("No g tag found inside the SVG");
        }
      })
      .catch((error) => {
        console.error("Error fetching or parsing SVG: ", error);
      });
  });

  return svg;
}

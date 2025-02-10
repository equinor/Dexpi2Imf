import React, { useEffect, useRef, useState } from "react";

import { useCommissioningPackages } from "../../hooks/useCommissioningPackages.tsx";
import styled from "styled-components";
import ZoomableSVGWrapper from "../editor/ZoomableSVGWrapper.tsx";
import {
  getAllCommissioningPackages,
  getGraphicalData,
} from "../../utils/Api.ts";
import SymbolGraphicalDataExample from "./SymbolGraphicalDataExample.tsx";
import { DiagramProps } from "../../types/diagram/GraphicalDataFormatTestTypes.ts";
import Line from "./LinesGraphicalDataExample.tsx";

const SVGContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default function PandIdGraphicalDataExample() {
  const { dispatch } = useCommissioningPackages();
  const [graphicalData, setGraphicalData] = useState<DiagramProps>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Step 1: Fetch existing commissioning packages
  useEffect(() => {
    (async () => {
      const packages = await getAllCommissioningPackages();
      const graphicalDataTest = await getGraphicalData("test");
      setGraphicalData(graphicalDataTest);
      dispatch({
        type: "SET_PACKAGES",
        payload: packages,
      });
    })();
  }, []);

  return (
    <SVGContainer ref={containerRef}>
      {graphicalData && (
        <ZoomableSVGWrapper
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
        >
          <svg
            viewBox={`${graphicalData.extent.min.x} ${graphicalData.extent.min.y} ${graphicalData.extent.max.x} ${graphicalData.extent.max.y}`}
            width={"100%"}
            height={"100%"}
          >
            {graphicalData.symbols.map((symbol, index) => (
              <SymbolGraphicalDataExample key={index} {...symbol} />
            ))}
            {graphicalData.lines.map((line, index) => (
              <Line key={index} {...line} />
            ))}
          </svg>
        </ZoomableSVGWrapper>
      )}
    </SVGContainer>
  );
}

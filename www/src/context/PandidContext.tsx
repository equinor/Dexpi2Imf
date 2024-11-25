import React, { createContext } from "react";

interface PandidContextProps {
  height: number;
  svgMap: Map<string, Element | null>;
  setSvgMap: React.Dispatch<React.SetStateAction<Map<string, Element | null>>>;
}

const PandidContext = createContext<PandidContextProps>({
  height: 0,
  svgMap: new Map(), // Initialize svgMap as an empty Map
  setSvgMap: () => {}, // Provide a no-op function as a placeholder
});

export default PandidContext;

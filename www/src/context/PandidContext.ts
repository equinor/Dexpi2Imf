import React, { createContext } from "react";

// TODO - remove when new graphical format is done
interface PandidContextProps {
  height: number;
  svgMap: Map<string, Element | null>;
  setSvgMap: React.Dispatch<React.SetStateAction<Map<string, Element | null>>>;
}

const PandidContext = createContext<PandidContextProps>({
  height: 0,
  svgMap: new Map(),
  setSvgMap: () => {},
});

export default PandidContext;

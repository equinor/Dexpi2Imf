import { createContext } from "react";

interface PandidContextProps {
  height: number;
}

const PandidContext = createContext<PandidContextProps>({
  height: 0,
});
export default PandidContext;

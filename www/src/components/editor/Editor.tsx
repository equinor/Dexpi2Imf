import Pandid from "../diagram/Pandid.tsx";
import EditorSidebar from "./EditorSidebar.tsx";
import { useState } from "react";
import Tools from "../../enums/Tools.ts";
import { CommissioningPackageContextProvider } from "../../context/CommissioningPackageContext.tsx";
import ToolContext from "../../context/ToolContext.tsx";
import EditorTopBar from "./EditorTopBar.tsx";
import styled from "styled-components";

const EditorContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SideBarAndPandid = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function Editor() {
  const [activeTool, setActiveTool] = useState(Tools.BOUNDARY);
  return (
    <CommissioningPackageContextProvider>
      <ToolContext.Provider value={{ activeTool, setActiveTool }}>
        <EditorContainer>
          <EditorTopBar />
          <SideBarAndPandid>
            <EditorSidebar />
            <Pandid />
          </SideBarAndPandid>
        </EditorContainer>
      </ToolContext.Provider>
    </CommissioningPackageContextProvider>
  );
}
